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
import { Requirements } from './requirements.ts';

const fixtures = fixtureMachos();

const emptyRequirements = new Requirements.Maker().make();
const emptyRequirementsData = new Uint8Array(
	emptyRequirements.buffer,
	emptyRequirements.byteOffset,
	emptyRequirements.length(),
);

const createBuilder = async (
	hashType: number,
): Promise<CodeDirectoryBuilder> => {
	const builder = new CodeDirectoryBuilder(hashType);
	if (typeof crypto === 'undefined') {
		builder.crypto = await import('node:crypto');
	}
	return builder;
};

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
		// deno-lint-ignore no-await-in-loop
		const builder = await createBuilder(hashType);
		builder.executable(
			new Blob([thin.slice(0)]),
			info.page,
			0,
			info.offset,
		);
		builder.flags(info.flags);
		builder.execSeg(info.execsegbase, info.execseglimit, info.execsegflags);
		builder.identifier(identifier);
		builder.teamID(teamID);
		if (infoPlist) {
			// deno-lint-ignore no-await-in-loop
			await builder.specialSlot(cdInfoSlot, infoPlist);
		}
		switch (requirements) {
			case '': {
				// No requirements.
				break;
			}
			case 'count=0 size=12': {
				// deno-lint-ignore no-await-in-loop
				await builder.specialSlot(
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
			await builder.specialSlot(cdResourceDirSlot, codeResources);
		}

		// Offical library always minimum supports scatter.
		assertEquals(
			Math.max(builder.minVersion(), CodeDirectory.supportsScatter),
			info.version,
		);

		yield builder.build(info.version);
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

			const maker = new EmbeddedSignatureBlob.Maker();
			maker.add(cdCodeDirectorySlot, cd0);

			if (!linkerSigned) {
				let cdAlt = cdAlternateCodeDirectorySlots;
				for (const cd of cds) {
					maker.add(cdAlt++, cd);
				}

				const { requirements } = info;
				switch (requirements) {
					case '': {
						// No requirements.
						break;
					}
					case 'count=0 size=12': {
						maker.add(cdRequirementsSlot, emptyRequirements);
						break;
					}
					default: {
						throw new Error(
							message(`Unknown requirements: ${requirements}`),
						);
					}
				}

				// Empty signature.
				maker.add(cdSignatureSlot, BlobWrapper.alloc());
			} else if (cds.length) {
				throw new Error(
					message(`Alt linker code directories: ${cds.length}`),
				);
			}

			const cs = maker.make();

			const csBuffer = new Uint8Array(
				cs.buffer,
				cs.byteOffset,
				cs.length(),
			);
			const expected = new Uint8Array(
				bin.buffer,
				bin.byteOffset + info.offset,
				cs.length(),
			);
			assertEquals(csBuffer, expected, message('compare'));
		}
	});
}
