import {
	array,
	type ArrayBufferReal,
	type BufferView,
	constant,
	member,
	Ptr,
	Uint8Ptr,
} from '@hqtsm/struct';
import { CSMAGIC_BLOBWRAPPER } from '../const.ts';
import { Blob } from './blob.ts';

/**
 * Generic blob wrapping arbitrary binary data.
 */
export class BlobWrapper extends Blob {
	declare public readonly ['constructor']: Omit<typeof BlobWrapper, 'new'>;

	/**
	 * Data of payload (only).
	 */
	declare public readonly dataArea: Uint8Ptr;

	/**
	 * Data of payload (only).
	 */
	public override get data(): Ptr {
		// Overridden to point to payload (only).
		const { dataArea } = this;
		return new Ptr(dataArea.buffer, dataArea.byteOffset, this.littleEndian);
	}

	/**
	 * Length of payload (only), set length for full blob.
	 */
	public override get length(): number {
		// Overridden to get length of payload (only).
		return super.length - 8;
	}

	public override set length(value: number) {
		// No change, needed to keep setter.
		super.length = value;
	}

	public static override readonly typeMagic = CSMAGIC_BLOBWRAPPER;

	/**
	 * Wrap data into a new blob.
	 *
	 * @param content Data to wrap, or number of bytes.
	 * @param magic Magic number.
	 * @returns Blob.
	 */
	public static alloc(
		content: ArrayBufferReal | BufferView | number = 0,
		magic = BlobWrapper.typeMagic,
	): BlobWrapper {
		const { BYTE_LENGTH } = BlobWrapper;
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
		const blob = new BlobWrapper(buffer);
		blob.initialize(magic, size);
		if (view) {
			new Uint8Array(buffer, BYTE_LENGTH).set(view);
		}
		return blob;
	}

	static {
		member(array(Uint8Ptr, 0), this, 'dataArea');
		constant(this, 'BYTE_LENGTH');
		constant(this, 'typeMagic');
	}
}
