import type { ArrayBufferReal, BufferView } from '@hqtsm/struct';
import type { Reader } from '../util/reader.ts';

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
		algo: string,
		data: ArrayBufferView | ArrayBuffer,
	) => Promise<ArrayBuffer>;
}

/**
 * Node crypto hash interface, sync.
 */
export interface HashCryptoNodeSync {
	/**
	 * Add data to hash.
	 *
	 * @param data Data.
	 */
	update(data: Uint8Array): void;

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
	write(data: Uint8Array, cb: (err?: unknown) => void): void;

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
	createHash(algo: string): HashCryptoNodeSync | HashCryptoNodeStream;
}

/**
 * Supported hash crypto implementations.
 */
export type HashCrypto = HashCryptoSubtle | HashCryptoNode;

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
	 * Create digest.
	 *
	 * @param source Source data.
	 * @returns Hash digest.
	 */
	public abstract digest(
		source: Reader | ArrayBufferReal | BufferView,
	): Promise<ArrayBuffer>;
}
