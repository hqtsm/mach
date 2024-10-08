import {describe, it} from 'node:test';
import {notStrictEqual} from 'node:assert';

import {machoThin, fixtureMachos, readMachoFiles} from '../util.spec.ts';

import {createCodeDirectories} from './codedirectorybuilder.spec.ts';

const fixtures = fixtureMachos();

void describe('codedirectorybuilder', () => {
	void describe('fixtures', () => {
		for (const {kind, arch, file, archs} of fixtures) {
			// Skip binaries with no signed architectures.
			if (![...archs.values()].filter(Boolean).length) {
				continue;
			}

			void it(`${kind}: ${arch}: ${file}`, async () => {
				const {macho, infoPlist, codeResources} = await readMachoFiles(
					kind,
					arch,
					file
				);

				for (const [arc, info] of archs) {
					// Skip unsigned architectures in fat binaries.
					if (!info) {
						continue;
					}

					const message = (s: string) => `CD: ${arc}: ${s}`;
					const thin = machoThin(macho, info.arch[0], info.arch[1]);

					// eslint-disable-next-line no-await-in-loop
					for await (const cd of createCodeDirectories(
						info,
						thin,
						infoPlist,
						codeResources
					)) {
						const cdBuffer = Buffer.from(
							cd.buffer,
							cd.byteOffset,
							cd.length
						);
						const expectedWithin = Buffer.from(
							thin.buffer,
							thin.byteOffset + info.offset,
							thin.byteLength - info.offset
						);
						notStrictEqual(
							expectedWithin.indexOf(cdBuffer),
							-1,
							message(`hashType=${cd.hashType}: within`)
						);
					}
				}
			});
		}
	});
});
