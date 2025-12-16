import { type Class, constant, toStringTag } from '@hqtsm/class';
import {
	array,
	type ArrayBufferPointer,
	member,
	Ptr,
	Uint8Ptr,
} from '@hqtsm/struct';
import { CSMAGIC_BLOBWRAPPER } from '../const.ts';
import { Blob } from './blob.ts';
import { BlobCore } from './blobcore.ts';

/**
 * Generic blob wrapping arbitrary binary data.
 */
export class BlobWrapper extends Blob {
	declare public readonly ['constructor']: Class<typeof BlobWrapper>;

	/**
	 * Data of payload (only).
	 */
	declare public readonly dataArea: Uint8Ptr;

	/**
	 * Data of payload (only).
	 *
	 * @returns Data pointer.
	 */
	public override data(): Ptr {
		// Overridden to point to payload (only).
		const { dataArea } = this;
		return new Ptr(dataArea.buffer, dataArea.byteOffset, this.littleEndian);
	}

	/**
	 * Length of payload (only), set length for full blob.
	 *
	 * @returns Byte length.
	 */
	public override length(): number;

	/**
	 * Set blob length for full blob, including magic and length.
	 * Unchanged from parent.
	 *
	 * @param size Byte length.
	 */
	public override length(size: number): void;

	/**
	 * Get or set blob length.
	 *
	 * @param size Byte length to set or undefined to get.
	 * @returns Byte length on get or undefined on set.
	 */
	public override length(size?: number): number | void {
		if (size === undefined) {
			return BlobCore.prototype.length.call<BlobWrapper, [], number>(
				this,
			) - BlobCore.BYTE_LENGTH;
		}
		super.length(size);
	}

	public static override readonly typeMagic = CSMAGIC_BLOBWRAPPER;

	/**
	 * Wrap data into a new blob.
	 *
	 * @param length Length of data.
	 * @param magic Magic number.
	 * @returns Blob.
	 */
	public static alloc(length: number, magic?: number): BlobWrapper;

	/**
	 * Wrap data into a new blob.
	 *
	 * @param data Data to wrap.
	 * @param length Length of data.
	 * @param magic Magic number.
	 * @returns Blob.
	 */
	public static alloc(
		data: ArrayBufferPointer | ArrayBufferLike,
		length: number,
		magic?: number,
	): BlobWrapper;

	/**
	 * Wrap data into a new blob.
	 *
	 * @param data Data to wrap.
	 * @param length Length of data.
	 * @param magic Magic number.
	 * @returns Blob.
	 */
	public static alloc(
		data: number | ArrayBufferPointer | ArrayBufferLike,
		length?: number,
		magic?: number,
	): BlobWrapper {
		const { BYTE_LENGTH } = BlobWrapper;
		let view;
		let size = BYTE_LENGTH;
		if (typeof data === 'number') {
			size += data;
			magic = length;
		} else {
			view = 'buffer' in data
				? new Uint8Array(data.buffer, data.byteOffset, length)
				: new Uint8Array(data, 0, length);
			size += view.byteLength;
		}
		magic ??= BlobWrapper.typeMagic;
		const buffer = new ArrayBuffer(size);
		const blob = new BlobWrapper(buffer);
		blob.initialize(magic, size);
		if (view) {
			new Uint8Array(buffer, BYTE_LENGTH).set(view);
		}
		return blob;
	}

	static {
		toStringTag(this, 'BlobWrapper');
		member(array(Uint8Ptr, 0), this, 'dataArea');
		constant(this, 'BYTE_LENGTH');
		constant(this, 'typeMagic');
	}
}
