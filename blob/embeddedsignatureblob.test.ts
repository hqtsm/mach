import { assertEquals } from '@std/assert';
import { fixtureMachos, machoThin, readMachoFiles } from '../util.spec.ts';
import {
	cdAlternateCodeDirectorySlots,
	cdCodeDirectorySlot,
	cdRequirementsSlot,
	cdSignatureSlot,
	kSecCodeSignatureHashSHA1,
	kSecCodeSignatureLinkerSigned,
} from '../const.ts';
import { createCodeDirectories } from './codedirectorybuilder.spec.ts';
import type { CodeDirectory } from './codedirectory.ts';
import { EmbeddedSignatureBlobMaker } from './embeddedsignatureblobmaker.ts';
import { RequirementsMaker } from './requirementsmaker.ts';
import { BlobWrapper } from './blobwrapper.ts';
import { EmbeddedSignatureBlob } from './embeddedsignatureblob.ts';

const fixtures = fixtureMachos();

Deno.test('BYTE_LENGTH', () => {
	assertEquals(EmbeddedSignatureBlob.BYTE_LENGTH, 12);
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
			const cds = [];

			for await (
				const cd of createCodeDirectories(
					info,
					thin,
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
						// Empty requirements.
						maker.add(
							cdRequirementsSlot,
							new RequirementsMaker().make(),
						);
						break;
					}
					default: {
						throw new Error(
							message(
								`Unknown requirements: ${requirements}`,
							),
						);
					}
				}

				// Empty signature.
				maker.add(cdSignatureSlot, BlobWrapper.alloc());
			} else if (cds.length) {
				throw new Error(
					message(
						`Alt linker code directories: ${cds.length}`,
					),
				);
			}

			const cs = maker.make();

			const csBuffer = new Uint8Array(
				cs.buffer,
				cs.byteOffset,
				cs.length,
			);
			const expected = new Uint8Array(
				thin.buffer,
				thin.byteOffset + info.offset,
				cs.length,
			);
			assertEquals(csBuffer, expected, message('compare'));
		}
	});
}
