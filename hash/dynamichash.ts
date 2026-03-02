import { toStringTag } from '@hqtsm/class/symbol';
import type { Reader } from '../util/reader.ts';
import type { SizeAsyncIterator, SizeIterator } from '../util/iterator.ts';
import type { ArrayBufferData } from '../util/memory.ts';

/**
 * Subtle crypto hash algorithm.
 */
export type HashCryptoSubtleAlgorithm =
	| 'SHA-1'
	| 'SHA-256'
	| 'SHA-384'
	| 'SHA-512';

/**
 * Subtle crypto hash interface.
 */
export interface HashCryptoSubtle {
	/**
	 * Create digest.
	 *
	 * @param algo Hash algorithm.
	 * @param data Data to be hashed.
	 * @returns Hash digest.
	 */
	digest: (
		algo: HashCryptoSubtleAlgorithm,
		data: ArrayBufferData,
	) => Promise<ArrayBuffer>;
}

/**
 * Subtle crypto hash interface with async generator extension.
 */
export interface HashCryptoSubtleAsyncGenerator {
	/**
	 * Create digest.
	 *
	 * @param algo Hash algorithm.
	 * @param data Data to be hashed.
	 * @returns Hash digest.
	 */
	digest: (
		algo: HashCryptoSubtleAlgorithm,
		data: ArrayBufferData | AsyncGenerator<ArrayBuffer>,
	) => Promise<ArrayBuffer>;
}

/**
 * Supported hash crypto implementations.
 */
export type HashCrypto = HashCryptoSubtle | HashCryptoSubtleAsyncGenerator;

/**
 * Dynamic hash.
 */
export abstract class DynamicHash {
	/**
	 * Hash crypto.
	 */
	public crypto: HashCrypto | null = null;

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
		source: Reader | ArrayBufferData,
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
