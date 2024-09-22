import {Blob} from './blob.ts';
import {CSMAGIC_BLOBWRAPPER} from './const.ts';
import {BufferView} from './type.ts';
import {viewDataW, viewUint8R} from './util.ts';

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
		return viewDataW(this, 8, this.length);
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
	 * @param data Data to wrap, or number of bytes.
	 * @param magic Magic number, or null for default.
	 * @returns Blob.
	 */
	public static alloc<T extends typeof BlobWrapper>(
		this: T,
		data: Readonly<BufferView> | number = 0,
		magic: number | null = null
	): T['prototype'] {
		const view = typeof data === 'number' ? null : viewUint8R(data);
		const wrapLength = 8 + (view ? view.byteLength : (data as number));
		const w = new Uint8Array(wrapLength);
		const blob = new this(w);
		blob.initialize(wrapLength, magic);
		if (view) {
			w.subarray(8).set(view);
		}
		return blob;
	}
}
