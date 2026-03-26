import type { size_t } from '../../libc/stddef.ts';
import type { DynamicHash } from '../../Security/hashing.ts';
import type { Reader } from '../../util/reader.ts';

/**
 * Hash file data.
 *
 * @param reader Reader.
 * @param hasher Hasher.
 * @param limit Limit.
 * @returns Size.
 */
export async function hashFileData(
	reader: Reader,
	hasher: DynamicHash,
	limit: size_t = 0,
): Promise<size_t> {
	await hasher.update(reader = limit ? reader.slice(0, limit) : reader);
	return reader.size;
}
