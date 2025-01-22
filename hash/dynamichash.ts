import type { ArrayBufferReal, BufferView } from '@hqtsm/struct';
import type { Reader } from '../util/reader.ts';

/**
 * Dynamic hash.
 */
export abstract class DynamicHash {
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
