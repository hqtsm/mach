import { type Class, constant, toStringTag } from '@hqtsm/class';
import { array, member, type Ptr, uint32BE } from '@hqtsm/struct';
import { Blob } from './blob.ts';
import { BlobCore } from './blobcore.ts';
import { SuperBlobCoreIndex } from './superblobcoreindex.ts';

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
	 * Data of payload (only).
	 */
	declare private readonly mIndex: Ptr<SuperBlobCoreIndex>;

	/**
	 * Setup size and number of blobs in super blob.
	 *
	 * @param size Blob length.
	 * @param count Number of blobs.
	 */
	public setup(size: number, count: number): void {
		SuperBlobCore.prototype.initializeLength.call(this, size);
		this.mCount = count;
	}

	/**
	 * Number of blobs in super blob.
	 *
	 * @returns Blob count.
	 */
	public count(): number {
		return this.mCount;
	}

	/**
	 * Get type of index.
	 *
	 * @param n Index.
	 * @returns Type.
	 */
	public type(n: number): number {
		n >>>= 0;
		return this.mIndex[n].type;
	}

	/**
	 * Get blob at index.
	 *
	 * @param n Index.
	 * @returns Blob or null if no offset in index.
	 */
	public blob(n: number): BlobCore | null {
		n >>>= 0;
		const { offset } = this.mIndex[n];
		return offset ? SuperBlobCore.at(this, BlobCore, offset) : null;
	}

	/**
	 * Find blob by type.
	 *
	 * @param type Index type.
	 * @returns First match or null.
	 */
	public find(type: number): BlobCore | null {
		type >>>= 0;
		const { mCount, mIndex } = this;
		for (let i = 0; i < mCount; i++) {
			const index = mIndex[i];
			if (index.type === type) {
				const { offset } = index;
				return offset ? SuperBlobCore.at(this, BlobCore, offset) : null;
			}
		}
		return null;
	}

	static {
		toStringTag(this, 'SuperBlobCore');
		uint32BE(this, 'mCount' as never);
		member(array(SuperBlobCoreIndex, 0), this, 'mIndex' as never);
		constant(this, 'BYTE_LENGTH');
		constant(this, 'typeMagic');
	}
}
