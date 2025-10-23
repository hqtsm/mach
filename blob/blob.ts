import { type ArrayBufferReal, type BufferView, constant } from '@hqtsm/struct';
import { BlobCore } from './blobcore.ts';

/**
 * Polymorphic memory blob for magic number.
 */
export class Blob extends BlobCore {
	declare public readonly ['constructor']: Omit<typeof Blob, 'new'>;

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
	public static override readonly typeMagic: number = 0;

	/**
	 * Wrap data into a new blob.
	 *
	 * @param content Data to wrap, or number of content bytes.
	 * @returns Blob data.
	 */
	public static blobify(
		content: ArrayBufferReal | BufferView | number = 0,
	): ArrayBuffer {
		const { BYTE_LENGTH } = Blob;
		let view;
		let size = BYTE_LENGTH;
		if (typeof content === 'number') {
			size += content;
		} else {
			view = 'buffer' in content
				? new Uint8Array(
					content.buffer,
					content.byteOffset,
					content.byteLength,
				)
				: new Uint8Array(content);
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
		return buffer;
	}

	static {
		constant(this, 'typeMagic');
	}
}
