import { assert, assertEquals } from '@std/assert';
import { cdInfoSlot, cdRequirementsSlot, cdResourceDirSlot } from '../const.ts';
import type { FixtureMachoSignatureInfo } from '../spec/fixture.ts';
import { unhex } from '../spec/hex.ts';
import { chunkedHashes, hash } from '../spec/hash.ts';
import { CodeDirectoryBuilder } from './codedirectorybuilder.ts';
import { CodeDirectory } from './codedirectory.ts';

export const emptyRequirements = unhex('FA DE 0C 01 00 00 00 0C 00 00 00 00');

export async function addCodeHashes(
	cd: CodeDirectoryBuilder,
	macho: Readonly<Uint8Array>,
): Promise<void> {
	const { pageSize } = cd;
	const hashes = await chunkedHashes(
		cd.hashType,
		macho,
		pageSize,
		0,
		cd.execLength,
	);
	for (let i = hashes.length; i--;) {
		cd.setCodeSlot(i, hashes[i]);
	}
}

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
		builder.flags(info.flags);
		builder.execLength = info.offset;
		builder.pageSize = info.page;
		builder.execSeg(
			BigInt(info.execsegbase),
			BigInt(info.execseglimit),
			BigInt(info.execsegflags),
		);
		builder.identifier(identifier);
		builder.teamID(teamID);
		if (infoPlist) {
			builder.setSpecialSlot(
				cdInfoSlot,
				// deno-lint-ignore no-await-in-loop
				await hash(hashType, infoPlist),
			);
		}
		let reqs = false;
		switch (requirements) {
			case '': {
				// No requirements.
				reqs = true;
				break;
			}
			case 'count=0 size=12': {
				builder.setSpecialSlot(
					cdRequirementsSlot,
					// deno-lint-ignore no-await-in-loop
					await hash(hashType, emptyRequirements),
				);
				reqs = true;
				break;
			}
		}
		assert(reqs, `Unknown requirements: ${requirements}`);
		if (codeResources) {
			builder.setSpecialSlot(
				cdResourceDirSlot,
				// deno-lint-ignore no-await-in-loop
				await hash(hashType, codeResources),
			);
		}
		// deno-lint-ignore no-await-in-loop
		await addCodeHashes(builder, thin);

		// Offical library always minimum supports scatter.
		assertEquals(
			Math.max(builder.version, CodeDirectory.supportsScatter),
			info.version,
		);

		yield builder.build(info.version);
	}
}
