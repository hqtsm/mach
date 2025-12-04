import { type Class, constant, type IsClass, toStringTag } from '@hqtsm/class';
import {
	type Arr,
	array,
	Int8Ptr,
	Ptr,
	Struct,
	uint32BE,
	Uint8Ptr,
} from '@hqtsm/struct';
import { EINVAL, ENOMEM } from '../const.ts';
import type { Reader } from '../util/reader.ts';

/**
 * Polymorphic memory blobs with magics numbers.
 */
export class BlobCore extends Struct {
	declare public readonly ['constructor']: Class<typeof BlobCore>;

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
	 */
	public magic(): number {
		return this.mMagic;
	}

	/**
	 * Get blob length.
	 * By default includes magic and length.
	 * Child classes may redefine this to be a smaller area.
	 *
	 * @returns Byte length.
	 */
	public length(): number;

	/**
	 * Set blob length.
	 * By default includes magic and length.
	 * Child classes may redefine this to be a smaller area.
	 *
	 * @param size Byte length.
	 */
	public length(size: number): void;

	/**
	 * Get or set blob length.
	 *
	 * @param size Byte length to set or undefined to get.
	 * @returns Byte length on get or undefined on set.
	 */
	public length(size?: number): number | void {
		if (size === undefined) {
			return this.mLength;
		}
		this.mLength = size;
	}

	/**
	 * Initialize blob with type and length.
	 *
	 * @param magic Magic number.
	 * @param length Length.
	 */
	public initialize(magic: number, length = 0): void {
		this.mMagic = magic;
		this.mLength = length >>> 0;
	}

	/**
	 * Validate blob.
	 *
	 * @param magic Magic number.
	 * @param minSize Minimum size.
	 * @param maxSize Maximum size.
	 * @param context Context.
	 * @returns Is valid.
	 */
	public validateBlob(
		magic: number,
		minSize?: number,
		maxSize?: number,
		context?: { errno: number },
	): boolean {
		const length = this.mLength;
		if ((magic && magic !== this.mMagic)) {
			if (context) context.errno = EINVAL;
			return false;
		}
		if (length < (minSize || 8)) {
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
	 * @param Type Constructor function.
	 * @param offset Byte offset.
	 * @param littleEndian Little endian, big endian, or inherit.
	 * @returns Data view.
	 */
	public at<T>(
		Type: new (
			buffer: ArrayBufferLike,
			byteOffset?: number,
			littleEndian?: boolean | null,
		) => T,
		offset: number,
		littleEndian: boolean | null = null,
	): T {
		return new Type(
			this.buffer,
			this.byteOffset + offset,
			littleEndian ?? this.littleEndian,
		);
	}

	/**
	 * Check if blob contains a range.
	 *
	 * @param offset Byte offset.
	 * @param size Byte size.
	 * @returns Is contained.
	 */
	public contains(offset: number, size: number): boolean {
		return offset >= 8 && size >= 0 && (offset + size) <= this.mLength;
	}

	/**
	 * Get string at offset.
	 *
	 * @param offset Byte offset.
	 * @returns String pointer if null terminated string or null.
	 */
	public stringAt(offset: number): Int8Ptr | null {
		let length = this.mLength;
		if (offset >= 0 && offset < length) {
			const s = this.at(Int8Ptr, offset);
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
	 * @returns Data pointer.
	 */
	public data(): Ptr {
		return new Ptr(this.buffer, this.byteOffset, this.littleEndian);
	}

	/**
	 * Clone blob.
	 *
	 * @returns Cloned blob.
	 */
	public clone(): BlobCore {
		const l = this.mLength;
		const o = this.byteOffset;
		return new BlobCore(this.buffer.slice(o, o + l), 0, this.littleEndian);
	}

	/**
	 * Inner byte data.
	 *
	 * @returns Uint8 byte array.
	 */
	public innerData(): Arr<number> {
		return new (array(Uint8Ptr, this.mLength - 8))(
			this.buffer,
			this.byteOffset + 8,
			this.littleEndian,
		);
	}

	/**
	 * Check if blob type match the expected magic.
	 *
	 * @template T Blob class.
	 * @param BlobType Blob type.
	 * @returns Is the same type.
	 */
	public is<T>(
		BlobType: T & IsClass<T, { readonly typeMagic: number }>,
	): boolean {
		return this.mMagic === BlobType.typeMagic;
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
		if (!header.validateBlob(magic || 0, minSize, maxSize, context)) {
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
