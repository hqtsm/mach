import {describe, it} from 'node:test';
import {deepStrictEqual, notStrictEqual} from 'node:assert';

import {
	fixtureMacho,
	hash,
	chunkedHashes,
	machoThin,
	fixtureMachos
} from '../util.spec.ts';
import {CodeDirectory} from './codedirectory.ts';
import {cdInfoSlot, cdRequirementsSlot, cdResourceDirSlot} from '../const.ts';
import {RequirementSet} from './requirementset.ts';
import {stringToBytes} from '../util.ts';
import {ReadonlyUint8Array} from '../type.ts';

const emptyRequirementSet = new RequirementSet();
const emptyRequirements = new Uint8Array(emptyRequirementSet.length);
emptyRequirementSet.byteWrite(emptyRequirements);

async function addCodeHashes(cd: CodeDirectory, macho: ReadonlyUint8Array) {
	const {pageSize} = cd;
	const hashes = await chunkedHashes(
		cd.hashType,
		macho,
		pageSize ? Math.pow(2, pageSize) : 0,
		0,
		cd.codeLimit
	);
	for (let i = hashes.length; i--; ) {
		cd.setSlot(i, false, hashes[i]);
	}
}

const fixtures = fixtureMachos();

void describe('blob/codedirectory', () => {
	void describe('fixtures', () => {
		for (const {kind, arch, file, archs} of fixtures) {
			// Skip binaries with no signed architectures.
			if (![...archs.values()].filter(Boolean).length) {
				continue;
			}

			void it(`${kind}: ${arch}: ${file}`, async () => {
				let resources: string[] | null = null;
				const bundle = file.match(
					/^((.*\/)?([^./]+\.(app|framework)))\/([^.]+\/)[^/]+$/
				);
				if (bundle) {
					const [, path, , , ext] = bundle;
					resources =
						ext === 'framework'
							? [
									'Resources/Info.plist',
									'_CodeSignature/CodeResources'
								].map(s => `${path}/Versions/A/${s}`)
							: [
									'Info.plist',
									'_CodeSignature/CodeResources'
								].map(s => `${path}/Contents/${s}`);
				}

				const files = await fixtureMacho(kind, arch, [
					file,
					...(resources || [])
				]);
				const [macho] = files;
				const infoPlist = resources ? files[1] : null;
				const codeResources = resources ? files[2] : null;

				for (const [arc, info] of archs) {
					if (!info) {
						continue;
					}

					const thin = machoThin(macho, info.arch[0], info.arch[1]);

					const {requirements} = info;
					for (const hashType of info.hashes) {
						const cd = new CodeDirectory();
						cd.version = info.version;
						cd.flags = info.flags;
						cd.codeLimit = info.offset;
						cd.hashType = hashType;
						cd.pageSize = Math.log2(info.page);
						cd.execSegBase = BigInt(info.execsegbase);
						cd.execSegLimit = BigInt(info.execseglimit);
						cd.execSegFlags = BigInt(info.execsegflags);
						cd.identifier = stringToBytes(info.identifier);
						cd.teamID = stringToBytes(info.teamid);
						if (infoPlist) {
							cd.setSlot(
								-cdInfoSlot,
								false,
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
								cd.setSlot(
									-cdRequirementsSlot,
									false,
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
							cd.setSlot(
								-cdResourceDirSlot,
								false,
								// eslint-disable-next-line no-await-in-loop
								await hash(hashType, codeResources)
							);
						}
						// eslint-disable-next-line no-await-in-loop
						await addCodeHashes(cd, thin);

						const data = new Uint8Array(cd.byteLength);
						cd.byteWrite(data);
						notStrictEqual(
							Buffer.from(thin).indexOf(
								Buffer.from(data),
								info.offset
							),
							-1,
							`CD: ${arc}: hashType=${hashType}`
						);

						const cd2 = new CodeDirectory();
						cd2.byteRead(data);
						deepStrictEqual(cd, cd2);

						for (let i = 0; i < cd2.nSpecialSlots; i++) {
							const nulled = new Uint8Array(cd.hashSize);
							deepStrictEqual(
								cd2.getSlot(-1 - i, false),
								cd.getSlot(-1 - i, false) || nulled
							);
						}

						for (let i = 0; i < cd2.nCodeSlots; i++) {
							deepStrictEqual(
								cd2.getSlot(i, false),
								cd.getSlot(i, false)
							);
							deepStrictEqual(
								cd2.getSlot(i, true),
								cd.getSlot(i, true)
							);
						}
					}
				}
			});
		}
	});
});
