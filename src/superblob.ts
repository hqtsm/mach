import {Blob} from './blob.ts';
import {BlobCore} from './blobcore.ts';

/**
 * SuperBlob class template.
 *
 * @param _magic Type magic number.
 * @returns SuperBlob class.
 */
export const SuperBlob = (_magic: number) =>
	//
	/**
	 * Multiple Blobs wrapped in a single indexed blob.
	 */
	class SuperBlob extends Blob(_magic) {
		public declare readonly ['constructor']: typeof SuperBlob;

		/**
		 * Setup size and number of blobs in super blob.
		 *
		 * @param size Blob length.
		 * @param count Number of blobs.
		 */
		public setup(size: number, count: number) {
			this.initialize2(size);
			this.#count = count;
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
			const count = this.#count;
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
			return this.#count;
		}

		/**
		 * Number of blobs in super blob.
		 *
		 * @returns Blobs count.
		 */
		get #count() {
			return this.dataView.getUint32(8);
		}

		/**
		 * Number of blobs in super blob.
		 *
		 * @param value Blobs count.
		 */
		set #count(value: number) {
			this.dataView.setUint32(8, value);
		}

		/**
		 * @inheritdoc
		 */
		public static readonly sizeof: number = 12;
	};
