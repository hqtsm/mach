import { constant, toStringTag } from '@hqtsm/class';
import { array, member, type Ptr, uint32BE } from '@hqtsm/struct';
import { Blob } from './blob.ts';
import { BlobCore } from './blobcore.ts';
import { SuperBlobCoreIndex } from './superblobcoreindex.ts';

/**
 * Multiple Blobs wrapped in a single indexed blob.
 */
export abstract class SuperBlobCore extends Blob {
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
	 * @param _this This.
	 * @param size Blob length.
	 * @param count Number of blobs.
	 */
	public static setup(
		_this: SuperBlobCore,
		size: number,
		count: number,
	): void {
		SuperBlobCore.initializeLength.call(this, _this, size);
		_this.mCount = count;
	}

	/**
	 * Number of blobs in super blob.
	 *
	 * @param _this This.
	 * @returns Blob count.
	 */
	public static count(_this: SuperBlobCore): number {
		return _this.mCount;
	}

	/**
	 * Get type of index.
	 *
	 * @param _this This.
	 * @param n Index.
	 * @returns Type.
	 */
	public static type(_this: SuperBlobCore, n: number): number {
		n >>>= 0;
		return _this.mIndex[n].type;
	}

	/**
	 * Get blob at index.
	 *
	 * @param _this This.
	 * @param n Index.
	 * @returns Blob or null if no offset in index.
	 */
	public static blob(_this: SuperBlobCore, n: number): BlobCore | null {
		n >>>= 0;
		const { offset } = _this.mIndex[n];
		return offset ? SuperBlobCore.at(_this, BlobCore, offset) : null;
	}

	/**
	 * Find blob by type.
	 *
	 * @param _this This.
	 * @param type Index type.
	 * @returns First match or null.
	 */
	public static find(_this: SuperBlobCore, type: number): BlobCore | null {
		type >>>= 0;
		const { mCount, mIndex } = _this;
		for (let i = 0; i < mCount; i++) {
			const index = mIndex[i];
			if (index.type === type) {
				const { offset } = index;
				return offset
					? SuperBlobCore.at(_this, BlobCore, offset)
					: null;
			}
		}
		return null;
	}

	static {
		toStringTag(this, 'SuperBlobCore');
		uint32BE(this, 'mCount' as never);
		member(array(SuperBlobCoreIndex, 0), this, 'mIndex' as never);
		constant(this, 'BYTE_LENGTH');
	}
}
