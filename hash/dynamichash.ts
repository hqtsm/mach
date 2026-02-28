import { toStringTag } from '@hqtsm/class/symbol';
import type { Reader } from '../util/reader.ts';

/**
 * Hash source generator.
 */
export type HashSourceGenerator = Generator<
	ArrayBufferLike | ArrayBufferView,
	// deno-lint-ignore no-explicit-any
	any,
	number
>;

/**
 * Hash source async generator.
 */
export type HashSourceAsyncGenerator = AsyncGenerator<
	ArrayBufferLike | ArrayBufferView,
	// deno-lint-ignore no-explicit-any
	any,
	number
>;

/**
 * Hash source.
 */
export type HashSource =
	| Reader
	| HashSourceGenerator
	| HashSourceAsyncGenerator
	| ArrayBufferLike
	| ArrayBufferView;

/**
 * Subtle crypto hash view.
 */
export interface HashCryptoSubtleView {
	/**
	 * Array buffer.
	 */
	readonly buffer: ArrayBuffer;

	/**
	 * Byte length.
	 */
	readonly byteLength: number;

	/**
	 * Byte offset.
	 */
	readonly byteOffset: number;
}

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
		data: HashCryptoSubtleView | ArrayBuffer,
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
	 * Update digest, can only be called once.
	 *
	 * @param source Source data.
	 * @returns Hash digest.
	 */
	public abstract update(source: HashSource): Promise<void>;

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
