import { constant, toStringTag } from '@hqtsm/class';
import { Int8Ptr, Ptr, Struct, uint32BE, Uint8Ptr } from '@hqtsm/struct';
import { EINVAL, ENOMEM } from '../const.ts';
import type { Reader } from '../util/reader.ts';

/**
 * BlobCore BlobType.
 */
export type BlobCoreBlobType =
	& { readonly typeMagic: number }
	& typeof BlobCore;

/**
 * Polymorphic memory blobs with magics numbers.
 */
export class BlobCore extends Struct {
	/**
	 * Magic number.
	 */
	declare protected mMagic: number;

	/**
	 * Blob length.
	 */
	declare protected mLength: number;

	/**
	 * Magic number.
	 *
	 * @param _this This.
	 * @returns Magic number.
	 */
	public static magic(_this: BlobCore): number {
		return _this.mMagic;
	}

	/**
	 * Get blob length.
	 * By default includes magic and length.
	 * Child classes may redefine this to be a smaller area.
	 *
	 * @param _this This.
	 * @returns Byte length.
	 */
	public static size(_this: BlobCore): number;

	/**
	 * Set blob length.
	 * By default includes magic and length.
	 * Child classes may redefine this to be a smaller area.
	 *
	 * @param _this This.
	 * @param size Byte length.
	 */
	public static size(_this: BlobCore, size: number): void;

	/**
	 * Get or set blob length.
	 *
	 * @param _this This.
	 * @param size Byte length to set or undefined to get.
	 * @returns Byte length on get or undefined on set.
	 */
	public static size(_this: BlobCore, size?: number): number | void {
		if (size === undefined) {
			return _this.mLength;
		}
		_this.mLength = size >>> 0;
	}

	/**
	 * Initialize blob with type and length.
	 *
	 * @param magic Magic number.
	 * @param length Length.
	 */
	public static initialize(_this: BlobCore, magic: number, length = 0): void {
		_this.mMagic = magic;
		_this.mLength = length >>> 0;
	}

	/**
	 * Validate blob.
	 *
	 * @param _this This.
	 * @param magic Magic number.
	 * @param minSize Minimum size.
	 * @param maxSize Maximum size.
	 * @param context Context.
	 * @returns Is valid.
	 */
	public static validateBlob(
		_this: BlobCore,
		magic: number,
		minSize?: number,
		maxSize?: number,
		context?: { errno: number },
	): boolean {
		const length = _this.mLength;
		if (magic && magic !== _this.mMagic) {
			if (context) context.errno = EINVAL;
			return false;
		}
		if (length < (minSize || BlobCore.BYTE_LENGTH)) {
			if (context) context.errno = EINVAL;
			return false;
		}
		if (maxSize && length > maxSize) {
			if (context) context.errno = ENOMEM;
			return false;
		}
		return true;
	}

	/**
	 * Get view of data at offset, with endian.
	 *
	 * @template T View type.
	 * @param _this This.
	 * @param Type Constructor function.
	 * @param offset Byte offset.
	 * @param littleEndian Little endian, big endian, or inherit.
	 * @returns Data view.
	 */
	public static at<T>(
		_this: BlobCore,
		Type: new (
			buffer: ArrayBufferLike,
			byteOffset?: number,
			littleEndian?: boolean | null,
		) => T,
		offset: number,
		littleEndian: boolean | null = null,
	): T {
		return new Type(
			_this.buffer,
			_this.byteOffset + offset,
			littleEndian ?? _this.littleEndian,
		);
	}

	/**
	 * Check if blob contains a range.
	 *
	 * @param _this This.
	 * @param offset Byte offset.
	 * @param size Byte size.
	 * @returns Is contained.
	 */
	public static contains(
		_this: BlobCore,
		offset: number,
		size: number,
	): boolean {
		return (
			offset >= BlobCore.BYTE_LENGTH &&
			size >= 0 &&
			(offset + size) <= BlobCore.size(_this)
		);
	}

	/**
	 * Get string at offset.
	 *
	 * @param _this This.
	 * @param offset Byte offset.
	 * @returns String pointer if null terminated string or null.
	 */
	public static stringAt(_this: BlobCore, offset: number): Int8Ptr | null {
		let length = BlobCore.size(_this);
		if (offset >= 0 && offset < length) {
			const s = BlobCore.at(_this, Int8Ptr, offset) as Int8Ptr;
			length -= offset;
			for (let i = 0; i < length; i++) {
				if (!s[i]) {
					return s;
				}
			}
		}
		return null;
	}

	/**
	 * Blob data.
	 * By default includes magic and length.
	 * Child classes may redefine this to be a smaller area.
	 *
	 * @param _this This.
	 * @returns Data pointer.
	 */
	public static data(_this: BlobCore): Ptr {
		return new Ptr(_this.buffer, _this.byteOffset, _this.littleEndian);
	}

	/**
	 * Clone blob.
	 *
	 * @param _this This.
	 * @returns Cloned blob.
	 */
	public static clone(_this: BlobCore): BlobCore | null {
		const l = BlobCore.size(_this);
		const b = new ArrayBuffer(l);
		new Uint8Array(b).set(
			new Uint8Array(_this.buffer, _this.byteOffset, l),
		);
		return new BlobCore(b, 0, _this.littleEndian);
	}

	/**
	 * Copy inner byte data.
	 *
	 * @param _this This.
	 * @returns Array buffer.
	 */
	public static innerData(_this: BlobCore): ArrayBuffer {
		const o = BlobCore.BYTE_LENGTH;
		const p = BlobCore.at(_this, Uint8Ptr, o);
		const l = BlobCore.size(_this) - o;
		const b = new ArrayBuffer(l);
		new Uint8Array(b).set(new Uint8Array(p.buffer, p.byteOffset, l));
		return b;
	}

	/**
	 * Check if blob type match the expected magic.
	 *
	 * @template T Blob class.
	 * @param _this This.
	 * @param BlobType Blob type.
	 * @returns Is the same type.
	 */
	public static is(this: BlobCoreBlobType, _this: BlobCore): boolean {
		return BlobCore.magic(_this) === this.typeMagic;
	}

	/**
	 * Read blob from reader.
	 *
	 * @param reader Reader.
	 * @returns Blob or null if not enough data for header.
	 */
	public static async readBlob(
		reader: Reader,
		context?: { errno: number },
	): Promise<BlobCore | null> {
		return await BlobCore.readBlobInternal(reader, 0, 0, 0, 0, context);
	}

	/**
	 * Read blob from reader.
	 *
	 * @param reader Reader.
	 * @param offset Byte offset.
	 * @param magic Magic number.
	 * @param minSize Minimum size.
	 * @param maxSize Maximum size.
	 * @returns Blob or null if not enough data for header.
	 */
	protected static async readBlobInternal(
		reader: Reader,
		offset: number,
		magic: number,
		minSize: number,
		maxSize: number,
		context?: { errno: number },
	): Promise<BlobCore | null> {
		reader = reader.slice(offset);
		if (reader.size < 8) {
			return null;
		}
		const head = await reader.slice(0, 8).arrayBuffer();
		const header = new BlobCore(head);
		if (
			!BlobCore.validateBlob(
				header,
				magic || 0,
				minSize,
				maxSize,
				context,
			)
		) {
			return null;
		}
		const length = header.mLength;
		if (reader.size < length) {
			if (context) context.errno = EINVAL;
			return null;
		}
		const data = new ArrayBuffer(length);
		const view = new Uint8Array(data);
		view.set(new Uint8Array(head), 0);
		view.set(
			new Uint8Array(await reader.slice(8, length).arrayBuffer()),
			8,
		);
		return new BlobCore(data);
	}

	static {
		toStringTag(this, 'BlobCore');
		uint32BE(this, 'mMagic' as never);
		uint32BE(this, 'mLength' as never);
		constant(this, 'BYTE_LENGTH');
	}
}
