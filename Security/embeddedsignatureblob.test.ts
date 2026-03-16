import { assertEquals } from '@std/assert';
import {
	cdAlternateCodeDirectorySlots,
	cdCodeDirectorySlot,
	cdInfoSlot,
	cdRequirementsSlot,
	cdResourceDirSlot,
	cdSignatureSlot,
	kSecCodeSignatureHashSHA1,
	kSecCodeSignatureLinkerSigned,
} from '../const.ts';
import {
	CPU_ARCHITECTURES,
	fixtureMachos,
	type FixtureMachoSignatureInfo,
	fixtureMachoSigned,
} from '../spec/fixture.ts';
import { thin } from '../spec/macho.ts';
import { BlobWrapper } from './blobwrapper.ts';
import { CodeDirectory } from './codedirectory.ts';
import { CodeDirectoryBuilder } from './codedirectorybuilder.ts';
import { EmbeddedSignatureBlob } from './embeddedsignatureblob.ts';
import { EmbeddedSignatureBlobMaker } from './embeddedsignatureblobmaker.ts';
import { RequirementsMaker } from './requirementsmaker.ts';
import { Requirements } from './requirements.ts';

const fixtures = fixtureMachos();

const emptyRequirements = RequirementsMaker.make(new RequirementsMaker());
const emptyRequirementsData = new Uint8Array(
	emptyRequirements.buffer,
	emptyRequirements.byteOffset,
	Requirements.size(emptyRequirements),
);

export async function* createCodeDirectories(
	info: Readonly<FixtureMachoSignatureInfo>,
	thin: Readonly<Uint8Array>,
	infoPlist: Readonly<Uint8Array> | null,
	codeResources: Readonly<Uint8Array> | null,
): AsyncGenerator<CodeDirectory> {
	const { requirements } = info;
	for (const hashType of info.hashes) {
		const identifier = new TextEncoder().encode(info.identifier);
		const teamID = new TextEncoder().encode(info.teamid);
		const builder = new CodeDirectoryBuilder(hashType);
		CodeDirectoryBuilder.executable(
			builder,
			new Blob([thin.slice()]),
			info.page,
			0,
			info.offset,
		);
		CodeDirectoryBuilder.flags(builder, info.flags);
		CodeDirectoryBuilder.execSeg(
			builder,
			info.execsegbase,
			info.execseglimit,
			info.execsegflags,
		);
		CodeDirectoryBuilder.identifier(builder, identifier);
		CodeDirectoryBuilder.teamID(builder, teamID);
		if (infoPlist) {
			// deno-lint-ignore no-await-in-loop
			await CodeDirectoryBuilder.specialSlot(
				builder,
				cdInfoSlot,
				infoPlist,
			);
		}
		switch (requirements) {
			case '': {
				// No requirements.
				break;
			}
			case 'count=0 size=12': {
				// deno-lint-ignore no-await-in-loop
				await CodeDirectoryBuilder.specialSlot(
					builder,
					cdRequirementsSlot,
					emptyRequirementsData,
				);
				break;
			}
			default: {
				throw new Error(`Unknown requirements: ${requirements}`);
			}
		}
		if (codeResources) {
			// deno-lint-ignore no-await-in-loop
			await CodeDirectoryBuilder.specialSlot(
				builder,
				cdResourceDirSlot,
				codeResources,
			);
		}

		// Offical library always minimum supports scatter.
		assertEquals(
			Math.max(
				CodeDirectoryBuilder.minVersion(builder),
				CodeDirectory.supportsScatter,
			),
			info.version,
		);

		yield CodeDirectoryBuilder.build(builder, info.version);
	}
}

Deno.test('BYTE_LENGTH', () => {
	assertEquals(EmbeddedSignatureBlob.BYTE_LENGTH, 12);
});

for (const { kind, arch, file, archs } of fixtures) {
	// Skip binaries with no signed architectures.
	if (![...archs.values()].filter(Boolean).length) {
		continue;
	}

	Deno.test(`${kind}: ${arch}: ${file}`, async () => {
		const { macho, infoPlist, codeResources } = await fixtureMachoSigned(
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
			const bin = thin(macho, ...CPU_ARCHITECTURES.get(arc)!);
			const cds = [];

			for await (
				const cd of createCodeDirectories(
					info,
					bin,
					infoPlist,
					codeResources,
				)
			) {
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
				cd0.flags & kSecCodeSignatureLinkerSigned
			);

			const maker = new EmbeddedSignatureBlobMaker();
			EmbeddedSignatureBlobMaker.add(maker, cdCodeDirectorySlot, cd0);

			if (!linkerSigned) {
				let cdAlt = cdAlternateCodeDirectorySlots;
				for (const cd of cds) {
					EmbeddedSignatureBlobMaker.add(maker, cdAlt++, cd);
				}

				const { requirements } = info;
				switch (requirements) {
					case '': {
						// No requirements.
						break;
					}
					case 'count=0 size=12': {
						EmbeddedSignatureBlobMaker.add(
							maker,
							cdRequirementsSlot,
							emptyRequirements,
						);
						break;
					}
					default: {
						throw new Error(
							message(`Unknown requirements: ${requirements}`),
						);
					}
				}

				// Empty signature.
				EmbeddedSignatureBlobMaker.add(
					maker,
					cdSignatureSlot,
					BlobWrapper.alloc(0),
				);
			} else if (cds.length) {
				throw new Error(
					message(`Alt linker code directories: ${cds.length}`),
				);
			}

			const cs = EmbeddedSignatureBlobMaker.make(maker);

			const csBuffer = new Uint8Array(
				cs.buffer,
				cs.byteOffset,
				EmbeddedSignatureBlob.size(cs),
			);
			const expected = new Uint8Array(
				bin.buffer,
				bin.byteOffset + info.offset,
				EmbeddedSignatureBlob.size(cs),
			);
			assertEquals(csBuffer, expected, message('compare'));
		}
	});
}
