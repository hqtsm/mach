import { type Class, constant } from '@hqtsm/class';
import { type Const, dataView, uint32BE } from '@hqtsm/struct';
import { Blob } from './blob.ts';
import { BlobCore } from './blobcore.ts';

/**
 * Multiple Blobs wrapped in a single indexed blob.
 */
export abstract class SuperBlobCore extends Blob {
	declare public readonly ['constructor']: Class<typeof SuperBlobCore>;

	/**
	 * Number of blobs in super blob.
	 */
	declare private mCount: number;

	/**
	 * Setup size and number of blobs in super blob.
	 *
	 * @param size Blob length.
	 * @param count Number of blobs.
	 */
	public setup(size: number, count: number): void {
		this.initializeLength(size);
		this.mCount = count;
	}

	/**
	 * Get type of index.
	 *
	 * @param index Index.
	 * @returns Type.
	 */
	public type(index: number): number {
		index = (+index || 0) - (index % 1 || 0);
		return dataView(this.buffer).getUint32(
			this.byteOffset + 12 + 8 * index,
		);
	}

	/**
	 * Get blob at index.
	 *
	 * @param index Index.
	 * @returns Blob or null if no offset in index.
	 */
	public blob(index: number): Const<BlobCore> | null {
		index = (+index || 0) - (index % 1 || 0);
		const offset = dataView(this.buffer).getUint32(
			this.byteOffset + 16 + 8 * index,
		);
		return offset ? this.at(BlobCore, offset) : null;
	}

	/**
	 * Find blob by type.
	 *
	 * @param type Index type.
	 * @returns First match or null.
	 */
	public find(type: number): Const<BlobCore> | null {
		const count = this.mCount;
		for (let i = 0; i < count; i++) {
			if (this.type(i) === type) {
				return this.blob(i);
			}
		}
		return null;
	}

	/**
	 * Number of blobs in super blob.
	 *
	 * @returns Blob count.
	 */
	public count(): number {
		return this.mCount;
	}

	static {
		uint32BE(this, 'mCount' as never);
		constant(this, 'BYTE_LENGTH');
		constant(this, 'typeMagic');
	}
}
