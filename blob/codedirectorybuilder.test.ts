import { assertNotEquals } from '@std/assert';
import {
	fixtureMachos,
	indexOf,
	machoThin,
	readMachoFiles,
} from '../util.spec.ts';
import { createCodeDirectories } from './codedirectorybuilder.spec.ts';

const fixtures = fixtureMachos();

for (const { kind, arch, file, archs } of fixtures) {
	// Skip binaries with no signed architectures.
	if (![...archs.values()].filter(Boolean).length) {
		continue;
	}

	Deno.test(`${kind}: ${arch}: ${file}`, async () => {
		const { macho, infoPlist, codeResources } = await readMachoFiles(
			kind,
			arch,
			file,
		);

		for (const [arc, info] of archs) {
			// Skip unsigned architectures in fat binaries.
			if (!info) {
				continue;
			}

			const message = (s: string) => `CD: ${arc}: ${s}`;
			const thin = machoThin(macho, info.arch[0], info.arch[1]);

			for await (
				const cd of createCodeDirectories(
					info,
					thin,
					infoPlist,
					codeResources,
				)
			) {
				const cdBuffer = new Uint8Array(
					cd.buffer,
					cd.byteOffset,
					cd.length,
				);
				const expectedWithin = new Uint8Array(
					thin.buffer,
					thin.byteOffset + info.offset,
					thin.byteLength - info.offset,
				);
				assertNotEquals(
					indexOf(expectedWithin, cdBuffer),
					-1,
					message(`hashType=${cd.hashType}: within`),
				);
			}
		}
	});
}
