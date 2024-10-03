import {chunkedHashes, unhex} from './util.spec.ts';
import {CodeDirectoryBuilder} from './codedirectorybuilder.ts';

export const emptyRequirements = unhex('FA DE 0C 01 00 00 00 0C 00 00 00 00');

export async function addCodeHashes(
	cd: CodeDirectoryBuilder,
	macho: Readonly<Uint8Array>
) {
	const {pageSize} = cd;
	const hashes = await chunkedHashes(
		cd.hashType,
		macho,
		pageSize,
		0,
		cd.execLength
	);
	for (let i = hashes.length; i--; ) {
		cd.setCodeSlot(i, hashes[i]);
	}
}
