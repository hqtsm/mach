import {describe, it} from 'node:test';
import {notStrictEqual} from 'node:assert';

import {machoThin, fixtureMachos, readMachoFiles} from './util.spec.ts';
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
					if (!info) {
						continue;
					}

					const thin = machoThin(macho, info.arch[0], info.arch[1]);
					// eslint-disable-next-line no-await-in-loop
					for await (const [hashType, cd] of createCodeDirectories(
						info,
						thin,
						infoPlist,
						codeResources
					)) {
						const message = `CD: ${arc}: hashType=${hashType}`;
						notStrictEqual(
							Buffer.from(thin).compare(
								Buffer.from(
									cd.buffer,
									cd.byteOffset,
									cd.byteLength
								),
								info.offset
							),
							-1,
							message
						);
					}
				}
			});
		}
	});
});
