import { type Class, constant, toStringTag } from '@hqtsm/class';
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
		return dataView(this.buffer).getUint32(
			this.byteOffset + 12 + 8 * n,
		);
	}

	/**
	 * Get blob at index.
	 *
	 * @param n Index.
	 * @returns Blob or null if no offset in index.
	 */
	public blob(n: number): Const<BlobCore> | null {
		n >>>= 0;
		const offset = dataView(this.buffer).getUint32(
			this.byteOffset + 16 + 8 * n,
		);
		return offset
			? (SuperBlobCore.prototype.at<BlobCore>).call(
				this,
				BlobCore,
				offset,
			)
			: null;
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
			if (SuperBlobCore.prototype.type.call(this, i) === type) {
				return SuperBlobCore.prototype.blob.call(this, i);
			}
		}
		return null;
	}

	static {
		toStringTag(this, 'SuperBlobCore');
		uint32BE(this, 'mCount' as never);
		constant(this, 'BYTE_LENGTH');
		constant(this, 'typeMagic');
	}
}
