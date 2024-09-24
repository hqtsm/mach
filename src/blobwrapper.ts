import {Blob} from './blob.ts';
import {CSMAGIC_BLOBWRAPPER} from './const.ts';
import type {BufferView, ReadonlyUint8Array} from './type.ts';
import {subview} from './util.ts';

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
		return subview(DataView, this, 8, this.length);
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
		let view: ReadonlyUint8Array | undefined;
		let size = 8;
		if (typeof content === 'number') {
			size += content;
		} else {
			view = subview(Uint8Array, content);
			size += view.byteLength;
		}
		const data = new Uint8Array(size);
		const blob = new this(data);
		blob.initialize(size, magic);
		if (view) {
			data.subarray(8).set(view);
		}
		return blob;
	}
}
