import {describe, it} from 'node:test';
import {notStrictEqual, strictEqual} from 'node:assert';

import {hash, machoThin, fixtureMachos, readMachoFiles} from './util.spec.ts';
import {CodeDirectory} from './codedirectory.ts';
import {cdInfoSlot, cdRequirementsSlot, cdResourceDirSlot} from './const.ts';
import {CodeDirectoryBuilder} from './codedirectorybuilder.ts';
import {addCodeHashes, emptyRequirements} from './codedirectorybuilder.spec.ts';

const fixtures = fixtureMachos();

void describe('blob/codedirectory', () => {
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

					const {requirements} = info;
					for (const hashType of info.hashes) {
						const message = `CD: ${arc}: hashType=${hashType}`;
						const builder = new CodeDirectoryBuilder(hashType);
						builder.flags = info.flags;
						builder.execLength = info.offset;
						builder.pageSize = info.page;
						builder.execSegOffset = BigInt(info.execsegbase);
						builder.execSegLimit = BigInt(info.execseglimit);
						builder.execSegFlags = BigInt(info.execsegflags);
						builder.identifier = new TextEncoder().encode(
							info.identifier
						);
						builder.teamID = new TextEncoder().encode(info.teamid);
						if (infoPlist) {
							builder.setSpecialSlot(
								cdInfoSlot,
								// eslint-disable-next-line no-await-in-loop
								await hash(hashType, infoPlist)
							);
						}
						switch (requirements) {
							case '': {
								// No requirements.
								break;
							}
							case 'count=0 size=12': {
								builder.setSpecialSlot(
									cdRequirementsSlot,
									// eslint-disable-next-line no-await-in-loop
									await hash(hashType, emptyRequirements)
								);
								break;
							}
							default: {
								throw new Error(
									`Unexpected requirements: ${requirements}`
								);
							}
						}
						if (codeResources) {
							builder.setSpecialSlot(
								cdResourceDirSlot,
								// eslint-disable-next-line no-await-in-loop
								await hash(hashType, codeResources)
							);
						}
						// eslint-disable-next-line no-await-in-loop
						await addCodeHashes(builder, thin);

						// Offical library always minimum supports scatter.
						strictEqual(
							Math.max(
								builder.version,
								CodeDirectory.supportsScatter
							),
							info.version
						);

						const cd = builder.build(info.version);
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
