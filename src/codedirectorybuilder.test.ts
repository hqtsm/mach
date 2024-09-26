import {describe, it} from 'node:test';
import {notStrictEqual, strictEqual} from 'node:assert';

import {
	fixtureMacho,
	hash,
	chunkedHashes,
	machoThin,
	fixtureMachos,
	unhex
} from './util.spec.ts';
import {CodeDirectory} from './codedirectory.ts';
import {cdInfoSlot, cdRequirementsSlot, cdResourceDirSlot} from './const.ts';
import {CodeDirectoryBuilder} from './codedirectorybuilder.ts';

const emptyRequirements = unhex('FA DE 0C 01 00 00 00 0C 00 00 00 00');

async function addCodeHashes(cd: CodeDirectoryBuilder, macho: Uint8Array) {
	const {pageSize} = cd;
	const hashes = await chunkedHashes(
		cd.hashType,
		macho,
		pageSize ? Math.pow(2, pageSize) : 0,
		0,
		cd.execLength
	);
	for (let i = hashes.length; i--; ) {
		cd.setCodeSlot(i, hashes[i]);
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
