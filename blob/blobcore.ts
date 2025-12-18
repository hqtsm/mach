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
	 *
	 * @param self This.
	 * @returns Magic number.
	 */
	public static magic(self: BlobCore): number {
		return self.mMagic;
	}

	/**
	 * Get blob length.
	 * By default includes magic and length.
	 * Child classes may redefine this to be a smaller area.
	 *
	 * @param self This.
	 * @returns Byte length.
	 */
	public static size(self: BlobCore): number;

	/**
	 * Set blob length.
	 * By default includes magic and length.
	 * Child classes may redefine this to be a smaller area.
	 *
	 * @param self This.
	 * @param size Byte length.
	 */
	public static size(self: BlobCore, size: number): void;

	/**
	 * Get or set blob length.
	 *
	 * @param self This.
	 * @param size Byte length to set or undefined to get.
	 * @returns Byte length on get or undefined on set.
	 */
	public static size(
		self: BlobCore,
		size?: number | undefined,
	): number | void {
		if (size === undefined) {
			return self.mLength;
		}
		self.mLength = size >>> 0;
	}

	/**
	 * Initialize blob with type and length.
	 *
	 * @param magic Magic number.
	 * @param length Length.
	 */
	public static initialize(self: BlobCore, magic: number, length = 0): void {
		self.mMagic = magic;
		self.mLength = length >>> 0;
	}

	/**
	 * Validate blob.
	 *
	 * @param self This.
	 * @param magic Magic number.
	 * @param minSize Minimum size.
	 * @param maxSize Maximum size.
	 * @param context Context.
	 * @returns Is valid.
	 */
	public static validateBlob(
		self: BlobCore,
		magic: number,
		minSize?: number,
		maxSize?: number,
		context?: { errno: number },
	): boolean {
		const length = self.mLength;
		if (magic && magic !== self.mMagic) {
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
	 * @param self This.
	 * @param Type Constructor function.
	 * @param offset Byte offset.
	 * @param littleEndian Little endian, big endian, or inherit.
	 * @returns Data view.
	 */
	public static at<T>(
		self: BlobCore,
		Type: new (
			buffer: ArrayBufferLike,
			byteOffset?: number,
			littleEndian?: boolean | null,
		) => T,
		offset: number,
		littleEndian: boolean | null = null,
	): T {
		return new Type(
			self.buffer,
			self.byteOffset + offset,
			littleEndian ?? self.littleEndian,
		);
	}

	/**
	 * Check if blob contains a range.
	 *
	 * @param self This.
	 * @param offset Byte offset.
	 * @param size Byte size.
	 * @returns Is contained.
	 */
	public static contains(
		self: BlobCore,
		offset: number,
		size: number,
	): boolean {
		return (
			offset >= BlobCore.BYTE_LENGTH &&
			size >= 0 &&
			(offset + size) <= BlobCore.size(self)
		);
	}

	/**
	 * Get string at offset.
	 *
	 * @param self This.
	 * @param offset Byte offset.
	 * @returns String pointer if null terminated string or null.
	 */
	public static stringAt(self: BlobCore, offset: number): Int8Ptr | null {
		let length = BlobCore.size(self);
		if (offset >= 0 && offset < length) {
			const s = BlobCore.at(self, Int8Ptr, offset) as Int8Ptr;
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
	 * @param self This.
	 * @returns Data pointer.
	 */
	public static data(self: BlobCore): Ptr {
		return new Ptr(self.buffer, self.byteOffset, self.littleEndian);
	}

	/**
	 * Clone blob.
	 *
	 * @param self This.
	 * @returns Cloned blob.
	 */
	public static clone(self: BlobCore): BlobCore | null {
		const l = BlobCore.size(self);
		const o = self.byteOffset;
		return new BlobCore(self.buffer.slice(o, o + l), 0, self.littleEndian);
	}

	/**
	 * Inner byte data.
	 *
	 * @param self This.
	 * @returns Uint8 byte array.
	 */
	public static innerData(self: BlobCore): Arr<number> {
		const o = BlobCore.BYTE_LENGTH;
		const p = BlobCore.at(self, Uint8Ptr, o);
		return new (array(Uint8Ptr, BlobCore.size(self) - o))(
			p.buffer,
			p.byteOffset,
			p.littleEndian,
		);
	}

	/**
	 * Check if blob type match the expected magic.
	 *
	 * @template T Blob class.
	 * @param self This.
	 * @param BlobType Blob type.
	 * @returns Is the same type.
	 */
	public static is<T>(
		self: BlobCore,
		BlobType: T & IsClass<T, { readonly typeMagic: number }>,
	): boolean {
		return BlobCore.magic(self) === BlobType.typeMagic;
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
