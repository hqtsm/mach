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
	 * @param self This.
	 * @param size Blob length.
	 * @param count Number of blobs.
	 */
	public static setup(
		self: SuperBlobCore,
		size: number,
		count: number,
	): void {
		this.initializeLength(self, size);
		self.mCount = count;
	}

	/**
	 * Number of blobs in super blob.
	 *
	 * @param self This.
	 * @returns Blob count.
	 */
	public static count(self: SuperBlobCore): number {
		return self.mCount;
	}

	/**
	 * Get type of index.
	 *
	 * @param self This.
	 * @param n Index.
	 * @returns Type.
	 */
	public static type(self: SuperBlobCore, n: number): number {
		n >>>= 0;
		return self.mIndex[n].type;
	}

	/**
	 * Get blob at index.
	 *
	 * @param self This.
	 * @param n Index.
	 * @returns Blob or null if no offset in index.
	 */
	public static blob(self: SuperBlobCore, n: number): BlobCore | null {
		n >>>= 0;
		const { offset } = self.mIndex[n];
		return offset ? SuperBlobCore.at(self, BlobCore, offset) : null;
	}

	/**
	 * Find blob by type.
	 *
	 * @param self This.
	 * @param type Index type.
	 * @returns First match or null.
	 */
	public static find(self: SuperBlobCore, type: number): BlobCore | null {
		type >>>= 0;
		const { mCount, mIndex } = self;
		for (let i = 0; i < mCount; i++) {
			const index = mIndex[i];
			if (index.type === type) {
				const { offset } = index;
				return offset ? SuperBlobCore.at(self, BlobCore, offset) : null;
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
