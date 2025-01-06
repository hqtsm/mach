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
	abstract digestLength(): number;

	/**
	 * Update hash state with data chunk.
	 *
	 * @param data Data to be hashed.
	 * @param transfer Transferable objects.
	 */
	abstract update(data: BufferView, transfer?: Transferable[]): Promise<void>;

	/**
	 * Finish digest.
	 *
	 * @returns Hash digest.
	 */
	abstract finish(): Promise<ArrayBuffer>;
}
