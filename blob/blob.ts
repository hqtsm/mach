import { type BufferView, constant } from '@hqtsm/struct';
import { BlobCore } from './blobcore.ts';

/**
 * Polymorphic memory blob for magic number.
 */
export class Blob extends BlobCore {
	declare public readonly ['constructor']: typeof Blob;

	/**
	 * Initialize blob with length.
	 *
	 * @param size Length.
	 */
	public initialize2(size = 0): void {
		this.initialize(this.constructor.typeMagic, size);
	}

	/**
	 * Type magic number for this blob.
	 *
	 * @returns Type magic number.
	 */
	public static readonly typeMagic: number = 0;

	/**
	 * Wrap data into a new blob.
	 *
	 * @param content Data to wrap, or number of bytes.
	 * @returns Blob data.
	 */
	public static blobify(content: BufferView | number = 0): Uint8Array {
		const { BYTE_LENGTH } = Blob;
		let view;
		let size = BYTE_LENGTH;
		if (typeof content === 'number') {
			size += content;
		} else {
			view = new Uint8Array(
				content.buffer,
				content.byteOffset,
				content.byteLength,
			);
			size += view.byteLength;
		}
		const buffer = new ArrayBuffer(size);
		const { typeMagic } = this;
		new (class extends Blob {
			public static override readonly typeMagic = typeMagic;
		})(buffer).initialize2(size);
		if (view) {
			new Uint8Array(buffer, BYTE_LENGTH).set(view);
		}
		return new Uint8Array(buffer);
	}

	static {
		constant(this, 'typeMagic');
	}
}
