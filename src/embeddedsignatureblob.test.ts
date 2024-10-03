import {describe, it} from 'node:test';
import {strictEqual} from 'node:assert';

import {machoThin, fixtureMachos, readMachoFiles} from './util.spec.ts';
import {
	cdAlternateCodeDirectorySlots,
	cdCodeDirectorySlot,
	cdRequirementsSlot,
	cdSignatureSlot,
	kSecCodeSignatureHashSHA1,
	kSecCodeSignatureLinkerSigned
} from './const.ts';
import {createCodeDirectories} from './codedirectorybuilder.spec.ts';
import type {CodeDirectory} from './codedirectory.ts';
import {EmbeddedSignatureBlobMaker} from './embeddedsignatureblobmaker.ts';
import {RequirementsMaker} from './requirementsmaker.ts';
import {BlobWrapper} from './blobwrapper.ts';

const fixtures = fixtureMachos();

void describe('embeddedsignatureblob', () => {
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
					const cds = [];

					// eslint-disable-next-line no-await-in-loop
					for await (const cd of createCodeDirectories(
						info,
						thin,
						infoPlist,
						codeResources
					)) {
						cds.push(cd);
					}

					let cd0: CodeDirectory | null = null;
					for (let i = 0; i < cds.length; i++) {
						if (cds[i].hashType === kSecCodeSignatureHashSHA1) {
							[cd0] = cds.splice(i, 1);
							break;
						}
					}
					if (!cd0) {
						cd0 = cds.shift()!;
					}

					const linkerSigned = !!(
						// eslint-disable-next-line no-bitwise
						(cd0.flags & kSecCodeSignatureLinkerSigned)
					);

					const maker = new EmbeddedSignatureBlobMaker();
					maker.add(cdCodeDirectorySlot, cd0);

					if (!linkerSigned) {
						let cdAlt = cdAlternateCodeDirectorySlots;
						for (const cd of cds) {
							maker.add(cdAlt++, cd);
						}

						const {requirements} = info;
						switch (requirements) {
							case '': {
								// No requirements.
								break;
							}
							case 'count=0 size=12': {
								// Empty requirements.
								maker.add(
									cdRequirementsSlot,
									new RequirementsMaker().make()
								);
								break;
							}
							default: {
								throw new Error(
									message(
										`Unknown requirements: ${requirements}`
									)
								);
							}
						}

						// Empty signature.
						maker.add(cdSignatureSlot, BlobWrapper.alloc());
					} else if (cds.length) {
						throw new Error(
							message(
								`Alt linker code directories: ${cds.length}`
							)
						);
					}

					const cs = maker.make();

					const csBuffer = Buffer.from(
						cs.buffer,
						cs.byteOffset,
						cs.byteLength
					);
					const expected = Buffer.from(
						thin.buffer,
						thin.byteOffset + info.offset,
						cs.byteLength
					);
					strictEqual(
						expected.compare(csBuffer),
						0,
						message('compare')
					);
				}
			});
		}
	});
});
