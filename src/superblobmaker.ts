import type {BlobCore} from './blobcore.ts';
import {SuperBlob} from './superblob.ts';

/**
 * SuperBlob maker class template.
 *
 * @param _SuperBlob SuperBlob class.
 * @returns SuperBlob class.
 */
export const SuperBlobMaker = (_SuperBlob: ReturnType<typeof SuperBlob>) =>
	//
	/**
	 * SuperBlob maker.
	 */
	class SuperBlobMaker {
		public declare readonly ['constructor']: Omit<
			typeof SuperBlobMaker,
			'new'
		>;

		/**
		 * Blobs in super blob.
		 */
		readonly #pieces = new Map<number, BlobCore>();

		/**
		 * Add blob to super blob.
		 *
		 * @param type Index type.
		 * @param blob Blob.
		 */
		public add(type: number, blob: BlobCore) {
			this.#pieces.set(type, blob);
		}

		/**
		 * Check if super blob contains type.
		 *
		 * @param type Index type.
		 * @returns Is contained.
		 */
		public contains(type: number) {
			return this.#pieces.has(type);
		}

		/**
		 * Get blob by type.
		 *
		 * @param type Index type.
		 * @returns Blob or null if not found.
		 */
		public get(type: number) {
			return this.#pieces.get(type) || null;
		}

		/**
		 * Get the size of super blob.
		 *
		 * @returns Byte length.
		 */
		public size() {
			let size = 12;
			for (const [, blob] of this.#pieces) {
				size += 8 + blob.byteLength;
			}
			return size;
		}

		/**
		 * Create the super blob.
		 *
		 * @returns SuperBlob.
		 */
		public make() {
			const pieces = this.#pieces;
			const count = pieces.size;
			const size = this.size();
			const buffer = new ArrayBuffer(size);
			const data = new Uint8Array(buffer);
			const view = new DataView(buffer);
			const sb = new _SuperBlob(buffer);
			sb.setup(size, count);
			let o1 = 12;
			let o2 = o1 + count * 8;
			const types = [...pieces.keys()].sort((a, b) => a - b);
			for (const type of types) {
				view.setUint32(o1, type);
				o1 += 4;
				view.setUint32(o1, o2);
				o1 += 4;
				const {buffer, byteOffset, byteLength} = pieces.get(type)!;
				data.set(new Uint8Array(buffer, byteOffset, byteLength), o2);
				o2 += byteLength;
			}
			return sb;
		}
	};
