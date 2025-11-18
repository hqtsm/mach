import { type Class, constant } from '@hqtsm/class';
import { BlobCore } from './blobcore.ts';

/**
 * Polymorphic memory blob for magic number.
 */
export class Blob extends BlobCore {
	declare public readonly ['constructor']: Class<typeof Blob>;

	/**
	 * Initialize blob with length, using known type magic.
	 *
	 * @param size Length.
	 */
	public initializeLength(size = 0): void {
		this.initialize(this.constructor.typeMagic, size);
	}

	/**
	 * Validate blob with length, using known type magic.
	 *
	 * @param length Optionally require exact length.
	 */
	public validateBlobLength(length?: number): void {
		const { byteLength } = this;
		if (length === undefined) {
			this.validateBlob(this.constructor.typeMagic, byteLength);
		} else {
			if (length < byteLength) {
				throw new RangeError('Invalid length');
			}
			this.validateBlob(this.constructor.typeMagic, byteLength);
			if (this.mLength !== length) {
				throw new RangeError('Invalid length');
			}
		}
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
		content: ArrayBufferLike | ArrayBufferView | number = 0,
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
		})(buffer).initializeLength(size);
		if (view) {
			new Uint8Array(buffer, BYTE_LENGTH).set(view);
		}
		return buffer;
	}

	static {
		constant(this, 'BYTE_LENGTH');
		constant(this, 'typeMagic');
	}
}
