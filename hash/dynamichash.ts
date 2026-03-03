import { toStringTag } from '@hqtsm/class/symbol';
import type { Reader } from '../util/reader.ts';
import type { SizeAsyncIterator, SizeIterator } from '../util/iterator.ts';
import type { ArrayBufferData } from '../util/memory.ts';
import type { SubtleCrypto, SubtleCryptoExtended } from '../util/crypto.ts';

/**
 * Dynamic hash crypto.
 */
export type DynamicHashCrypto =
	| Pick<SubtleCrypto, 'digest'>
	| Pick<SubtleCryptoExtended, 'digest'>;

/**
 * Dynamic hash.
 */
export abstract class DynamicHash {
	/**
	 * Hash crypto.
	 */
	public crypto: DynamicHashCrypto | null = null;

	/**
	 * Get the digest length.
	 *
	 * @returns Digest byte length.
	 */
	public abstract digestLength(): number;

	/**
	 * Update digest, can only be called once.
	 *
	 * @param source Source data.
	 * @returns Hash digest.
	 */
	public abstract update(
		source:
			| Reader
			| ArrayBufferData,
	): Promise<void>;

	/**
	 * Update digest, can only be called once.
	 *
	 * @param source Source data.
	 * @param size Source size.
	 * @returns Hash digest.
	 */
	public abstract update(
		source:
			| SizeIterator<ArrayBufferData>
			| SizeAsyncIterator<ArrayBufferData>,
		size: number,
	): Promise<void>;

	/**
	 * Finish hash, can only be called once.
	 *
	 * @returns Hash digest.
	 */
	public abstract finish(): Promise<ArrayBuffer>;

	static {
		toStringTag(this, 'DynamicHash');
	}
}
