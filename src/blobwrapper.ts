import {Blob} from './blob.ts';
import {CSMAGIC_BLOBWRAPPER} from './const.ts';
import type {BufferView} from './type.ts';

/**
 * Generic Blob.
 */
export class BlobWrapper extends Blob {
	public declare readonly ['constructor']: typeof BlobWrapper;

	/**
	 * Data of payload (only).
	 *
	 * @inheritdoc
	 */
	public get data() {
		// Overridden to point to payload (only).
		return new DataView(this.buffer, this.byteOffset + 8);
	}

	/**
	 * Get length of payload (only), set length for full blob.
	 *
	 * @inheritdoc
	 */
	public get length() {
		// Overridden to get length of payload (only).
		return super.length - 8;
	}

	/**
	 * Get length of payload (only), set length for full blob.
	 *
	 * @inheritdoc
	 */
	public set length(value: number) {
		// No change, needed to keep setter.
		super.length = value;
	}

	/**
	 * @inheritdoc
	 */
	public static readonly typeMagic: number = CSMAGIC_BLOBWRAPPER;

	/**
	 * Wrap data into a new blob.
	 *
	 * @param content Data to wrap, or number of bytes.
	 * @param magic Magic number, or null for default.
	 * @returns Blob.
	 */
	public static alloc<T extends typeof BlobWrapper>(
		this: T,
		content: Readonly<BufferView> | number = 0,
		magic: number | null = null
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
		blob.initialize(size, magic);
		if (view) {
			new Uint8Array(buffer, 8).set(view);
		}
		return blob;
	}
}
