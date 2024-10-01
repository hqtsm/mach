import {BlobCore} from './blobcore.ts';
import type {BufferView} from './type.ts';

/**
 * Blob class template.
 *
 * @param _magic Type magic number.
 * @returns Blob class.
 */
export const Blob = (_magic: number) =>
	//
	/**
	 * Polymorphic memory blob for magic number.
	 */
	class Blob extends BlobCore {
		public declare readonly ['constructor']: typeof Blob;

		/**
		 * Initialize blob with length.
		 *
		 * @param size Length.
		 */
		public initialize2(size = 0) {
			this.initialize(this.constructor.typeMagic, size);
		}

		/**
		 * Type magic number for new instance.
		 */
		public static readonly typeMagic = _magic;

		/**
		 * Wrap data into a new blob.
		 *
		 * @param content Data to wrap, or number of bytes.
		 * @returns Blob.
		 */
		public static blobify<T extends typeof Blob>(
			this: T,
			content: Readonly<BufferView> | number = 0
		): T['prototype'] {
			let view;
			let size = 8;
			if (typeof content === 'number') {
				size += content;
			} else {
				view = new Uint8Array(
					content.buffer,
					content.byteOffset,
					content.byteLength
				);
				size += view.byteLength;
			}
			const buffer = new ArrayBuffer(size);
			const blob = new this(buffer);
			blob.initialize2(size);
			if (view) {
				new Uint8Array(buffer, 8).set(view);
			}
			return blob;
		}
	};
