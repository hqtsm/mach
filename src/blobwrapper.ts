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
	 * Overridden to point to payload (only).
	 * Apple weirdness.
	 *
	 * @inheritdoc
	 */
	public get data() {
		return viewDataW(this, 8, this.length);
	}

	/**
	 * Overridden to point to payload (only).
	 * Apple weirdness.
	 *
	 * @inheritdoc
	 */
	public get length() {
		return super.length - 8;
	}

	/**
	 * Unchanged from parent setter.
	 *
	 * @inheritdoc
	 */
	public set length(value: number) {
		super.length = value;
	}

	/**
	 * @inheritdoc
	 */
	public static readonly typeMagic: number = CSMAGIC_BLOBWRAPPER;

	/**
	 * Wrap data into a new blob.
	 *
	 * @param data Data to wrap.
	 * @param magic Magic number.
	 * @returns Blob.
	 */
	public static alloc<T extends typeof BlobWrapper>(
		this: T,
		data: Readonly<BufferView> | number,
		magic = this.typeMagic
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
