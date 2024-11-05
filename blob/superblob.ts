import { structU32 } from '../struct.ts';

import { Blob } from './blob.ts';
import { BlobCore } from './blobcore.ts';

/**
 * Multiple Blobs wrapped in a single indexed blob.
 */
export class SuperBlob extends Blob {
	declare public readonly ['constructor']: typeof SuperBlob;

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
	public setup(size: number, count: number) {
		this.initialize2(size);
		this.mCount = count;
	}

	/**
	 * Get type of index.
	 *
	 * @param index Index.
	 * @returns Type.
	 */
	public type(index: number) {
		return this.dataView.getUint32(12 + 8 * index);
	}

	/**
	 * Get blob at index.
	 *
	 * @param index Index.
	 * @returns Blob or null if no offset in index.
	 */
	public blob(index: number) {
		const offset = this.dataView.getUint32(16 + 8 * index);
		return offset ? this.at(BlobCore, offset) : null;
	}

	/**
	 * Find blob by type.
	 *
	 * @param type Index type.
	 * @returns First match or null.
	 */
	public find(type: number) {
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
	 * @returns Blobs count.
	 */
	public get count() {
		return this.mCount;
	}

	/**
	 * @inheritdoc
	 */
	public static override readonly BYTE_LENGTH = ((o) => {
		o += structU32(this, o, 'mCount' as never, false);
		return o;
	})(super.BYTE_LENGTH);
}
