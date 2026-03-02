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
 * Node crypto hash algorithm.
 */
export type HashCryptoNodeAlgorithm =
	| 'sha1'
	| 'sha256'
	| 'sha384'
	| 'sha512';

/**
 * Node crypto hash interface, sync.
 */
export interface HashCryptoNodeSync {
	/**
	 * Add data to hash.
	 *
	 * @param data Data.
	 */
	update(data: Uint8Array<ArrayBuffer>): void;

	/**
	 * Get digest.
	 *
	 * @returns Hash digest.
	 */
	digest(): ArrayBufferView;
}

/**
 * Node crypto hash interface, async.
 */
export interface HashCryptoNodeStream {
	/**
	 * Write data to hash.
	 *
	 * @param data Data.
	 * @param cb Callback.
	 */
	write(data: Uint8Array<ArrayBuffer>, cb: (err?: unknown) => void): void;

	/**
	 * End hash.
	 *
	 * @param cb Callback.
	 */
	end(cb: (err?: unknown) => void): void;

	/**
	 * Get digest.
	 *
	 * @returns Hash digest.
	 */
	read(): ArrayBufferView;
}

/**
 * Node crypto hash interface.
 */
export interface HashCryptoNode {
	/**
	 * Create hash.
	 *
	 * @param algo Hash algorithm.
	 */
	createHash(
		algo: HashCryptoNodeAlgorithm,
	): HashCryptoNodeSync | HashCryptoNodeStream;
}

/**
 * Supported hash crypto implementations.
 */
export type HashCrypto =
	| HashCryptoSubtle
	| HashCryptoSubtleAsyncGenerator
	| HashCryptoNode;

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
