import { assertEquals, assertNotEquals } from '@std/assert';
import {
	fixtureMachos,
	indexOf,
	machoThin,
	readMachoFiles,
} from '../util.spec.ts';
import { createCodeDirectories } from './codedirectorybuilder.spec.ts';
import { CodeDirectoryBuilder } from './codedirectorybuilder.ts';
import { kSecCodeSignatureHashSHA1 } from '../const.ts';

const fixtures = fixtureMachos();

Deno.test('codeSlots', () => {
	const builder = new CodeDirectoryBuilder(kSecCodeSignatureHashSHA1);
	assertEquals(builder.codeSlots, 0);
	builder.execLength = 1;
	assertEquals(builder.codeSlots, 1);
	builder.pageSize = 1024;
	builder.execLength = 1024;
	assertEquals(builder.codeSlots, 1);
	builder.execLength = 1025;
	assertEquals(builder.codeSlots, 2);
});

Deno.test('addExecSegFlags', () => {
	const builder = new CodeDirectoryBuilder(kSecCodeSignatureHashSHA1);
	builder.addExecSegFlags(1n);
	assertEquals(builder.execSegFlags, 1n);
	builder.addExecSegFlags(2n);
	assertEquals(builder.execSegFlags, 3n);
	builder.addExecSegFlags(4n);
	assertEquals(builder.execSegFlags, 7n);
});

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
