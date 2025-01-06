import type { BufferView } from '@hqtsm/struct';

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
	 * Update hash state with data chunk.
	 *
	 * @param data Data to be hashed.
	 * @param transfer Transfer ArrayBuffer.
	 */
	public abstract update(data: BufferView, transfer?: boolean): Promise<void>;

	/**
	 * Finish digest.
	 *
	 * @returns Hash digest.
	 */
	public abstract finish(): Promise<ArrayBuffer>;
}
