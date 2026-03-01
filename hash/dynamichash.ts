import { toStringTag } from '@hqtsm/class/symbol';
import type { Reader } from '../util/reader.ts';

/**
 * Hash source iterator yield.
 */
export interface HashSourceIteratorYield {
	/**
	 * Not done.
	 */
	done?: false;

	/**
	 * Value.
	 */
	value: ArrayBufferLike | ArrayBufferView;
}

/**
 * Hash source iterator return.
 */
export interface HashSourceIteratorReturn {
	/**
	 * Done.
	 */
	done: true;
}

/**
 * Hash source iterator.
 */
export interface HashSourceIterator {
	/**
	 * Get the next value.
	 *
	 * @param size Requested size.
	 * @returns Next value.
	 */
	next(size?: number):
		| HashSourceIteratorYield
		| HashSourceIteratorReturn;

	/**
	 * Close iterator.
	 */
	// deno-lint-ignore no-explicit-any
	return?(value?: any): any;
}

/**
 * Hash source async iterator.
 */
export interface HashSourceAsyncIterator {
	/**
	 * Get the next value.
	 *
	 * @param size Requested size.
	 * @returns Next value.
	 */
	next(size?: number): Promise<
		| HashSourceIteratorYield
		| HashSourceIteratorReturn
	>;

	/**
	 * Close iterator.
	 */
	// deno-lint-ignore no-explicit-any
	return?(value?: any): Promise<any>;
}

/**
 * Subtle crypto hash algorithm.
 */
export type HashCryptoSubtleAlgorithm =
	| 'SHA-1'
	| 'SHA-256'
	| 'SHA-384'
	| 'SHA-512';

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
		algo: HashCryptoSubtleAlgorithm,
		data: HashCryptoSubtleView | ArrayBuffer,
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
	createHash(
		algo: HashCryptoNodeAlgorithm,
	): HashCryptoNodeSync | HashCryptoNodeStream;
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
	public abstract update(
		source: Reader | ArrayBufferLike | ArrayBufferView,
	): Promise<void>;

	/**
	 * Update digest, can only be called once.
	 *
	 * @param source Source data.
	 * @param size Source size.
	 * @returns Hash digest.
	 */
	public abstract update(
		source: HashSourceIterator | HashSourceAsyncIterator,
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
