import { type Concrete, constant, toStringTag } from '@hqtsm/class';
import {
	type Arr,
	array,
	type ArrayBufferPointer,
	type Const,
	Int8Ptr,
	member,
	Ptr,
	Struct,
	uint32BE,
	Uint8Ptr,
} from '@hqtsm/struct';
import { CSMAGIC_BLOBWRAPPER } from '../kern/cs_blobs.ts';
import { EINVAL, ENOMEM } from '../libc/errno.ts';
import { malloc } from '../libc/stdlib.ts';
import { type ArrayBufferLikeData, asUint8Array } from '../util/memory.ts';
import type { Reader } from '../util/reader.ts';
import { MacOSError, UnixError } from './errors.ts';
import { errSecAllocate } from './SecBase.ts';

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
		const b = malloc(l);
		if (b) {
			new Uint8Array(b).set(
				new Uint8Array(_this.buffer, _this.byteOffset, l),
			);
			return new BlobCore(b, 0, _this.littleEndian);
		}
		UnixError.throwMe(ENOMEM);
	}

	/**
	 * Inner byte data.
	 *
	 * @param _this This.
	 * @returns Uint8 byte array.
	 */
	public static innerData(_this: BlobCore): Const<Arr<number>> {
		const o = BlobCore.BYTE_LENGTH;
		const p = BlobCore.at(_this, Uint8Ptr, o);
		return new (array(Uint8Ptr, BlobCore.size(_this) - o))(
			p.buffer,
			p.byteOffset,
			p.littleEndian,
		);
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

/**
 * Blob template.
 */
export type TemplateBlob = Concrete<typeof Blob> & typeof Blob;

/**
 * Polymorphic memory blob for magic number.
 */
export abstract class Blob extends BlobCore {
	/**
	 * Initialize blob with length, using known type magic.
	 *
	 * @param _this This.
	 * @param size Length.
	 */
	public static initializeSize(_this: Blob, size = 0): void {
		BlobCore.initialize(_this, this.typeMagic, size);
	}

	/**
	 * Validate blob with length, using known type magic.
	 *
	 * @param _this This.
	 * @param context Context.
	 * @returns Is valid.
	 */
	public static validateBlobSize(
		_this: Blob,
		context?: { errno: number },
	): boolean;

	/**
	 * Validate blob with length, using known type magic.
	 *
	 * @param _this This.
	 * @param length Require exact length.
	 * @param context Context.
	 * @returns Is valid.
	 */
	public static validateBlobSize(
		_this: Blob,
		length: number,
		context?: { errno: number },
	): boolean;

	/**
	 * Validate blob with length, using known type magic.
	 *
	 * @param _this This.
	 * @param length Exact length or context.
	 * @param context Context.
	 * @returns Is valid.
	 */
	public static validateBlobSize(
		_this: Blob,
		length?: number | { errno: number },
		context?: { errno: number },
	): boolean {
		if (typeof length === 'number') {
			return (
				length >= _this.byteLength &&
				Blob.validateBlobSize.call<
					typeof this,
					[typeof _this, typeof context],
					boolean
				>(this, _this, context) &&
				_this.mLength === length
			);
		}
		return BlobCore.validateBlob(
			_this,
			this.typeMagic,
			_this.byteLength,
			undefined,
			length,
		);
	}

	/**
	 * Clone blob.
	 *
	 * @template T Blob type.
	 * @param this Blob class.
	 * @param _this This.
	 * @param context Context.
	 * @returns Cloned blob.
	 */
	public static override clone<T extends TemplateBlob>(
		this: T,
		_this: Blob,
		context?: { errno: number },
	): T['prototype'] | null {
		const c = BlobCore.clone(_this);
		return c && Blob.specific.call(this, c, context);
	}

	/**
	 * Type magic number for this blob.
	 *
	 * @returns Type magic number.
	 */
	public static readonly typeMagic: number = 0;

	/**
	 * Cast blob to specific type.
	 *
	 * @template T Blob type.
	 * @param this Blob class.
	 * @param blob Blob.
	 * @param context Context.
	 * @returns Cast blob or null.
	 */
	public static specific<T extends TemplateBlob>(
		this: T,
		blob: BlobCore,
		context?: { errno: number },
	): T['prototype'] | null {
		const p = new this(blob.buffer, blob.byteOffset, blob.littleEndian);
		return Blob.validateBlobSize.call<
				typeof this,
				[typeof p, typeof context],
				boolean
			>(this, p, context)
			? p
			: null;
	}

	/**
	 * Wrap data into a new blob.
	 *
	 * @param content Data to wrap.
	 * @returns Blob data.
	 */
	public static blobify(content: ArrayBufferLikeData): ArrayBuffer {
		const { typeMagic } = this;
		const { BYTE_LENGTH } = BlobCore;
		const view = asUint8Array(content);
		const size = BYTE_LENGTH + view.byteLength;
		const data = malloc(size);
		if (!data) {
			MacOSError.throwMe(errSecAllocate);
		}
		class B extends Blob {
			public static override readonly typeMagic = typeMagic;
		}
		B.initializeSize(new B(data), size);
		new Uint8Array(data, BYTE_LENGTH).set(view);
		return data;
	}

	/**
	 * Read blob from reader.
	 *
	 * @template T Blob type.
	 * @param this Blob class.
	 * @param reader Reader.
	 * @param context Context.
	 * @returns Blob or null if not valid.
	 */
	public static override async readBlob<T extends TemplateBlob>(
		this: T,
		reader: Reader,
		context?: { errno: number },
	): Promise<T['prototype'] | null>;

	/**
	 * Read blob from reader.
	 *
	 * @template T Blob type.
	 * @param this Blob class.
	 * @param reader Reader.
	 * @param offset Byte offset.
	 * @param maxSize Maximum size.
	 * @param context Context.
	 * @returns Blob or null if not valid.
	 */
	public static override async readBlob<T extends TemplateBlob>(
		this: T,
		reader: Reader,
		offset: number,
		maxSize?: number,
		context?: { errno: number },
	): Promise<T['prototype'] | null>;

	/**
	 * Read blob from reader.
	 *
	 * @template T Blob type.
	 * @param this Blob class.
	 * @param reader Reader.
	 * @param offset Byte offset or context.
	 * @param maxSize Maximum size.
	 * @param context Context.
	 * @returns Blob or null if not valid.
	 */
	public static override async readBlob<T extends TemplateBlob>(
		this: T,
		reader: Reader,
		offset?: number | { errno: number },
		maxSize?: number,
		context?: { errno: number },
	): Promise<T['prototype'] | null> {
		if (typeof offset !== 'number') {
			context = offset;
			maxSize = offset = 0;
		}
		const p = await BlobCore.readBlobInternal(
			reader,
			offset,
			this.typeMagic,
			0,
			maxSize || 0,
			context,
		);
		return p ? Blob.specific.call(this, p, context) : p;
	}

	static {
		toStringTag(this, 'Blob');
		constant(this, 'BYTE_LENGTH');
		constant(this, 'typeMagic');
	}
}

/**
 * Generic blob wrapping arbitrary binary data.
 */
export class BlobWrapper extends Blob {
	/**
	 * Data of payload (only).
	 */
	declare public readonly dataArea: Uint8Ptr;

	/**
	 * Data of payload (only).
	 *
	 * @param _this This.
	 * @returns Data pointer.
	 */
	public static override data(_this: BlobWrapper): Ptr {
		// Overridden to point to payload (only).
		const { dataArea } = _this;
		return new Ptr(
			dataArea.buffer,
			dataArea.byteOffset,
			_this.littleEndian,
		);
	}

	/**
	 * Length of payload (only), set length for full blob.
	 *
	 * @param _this This.
	 * @returns Byte length.
	 */
	public static override length(_this: BlobWrapper): number;

	/**
	 * Set blob length for full blob, including magic and length.
	 * Unchanged from parent.
	 *
	 * @param _this This.
	 * @param size Byte length.
	 */
	public static override length(_this: BlobWrapper, size: number): void;

	/**
	 * Get or set blob length.
	 *
	 * @param _this This.
	 * @param size Byte length to set or undefined to get.
	 * @returns Byte length on get or undefined on set.
	 */
	public static override length(
		_this: BlobWrapper,
		size?: number,
	): number | void {
		if (size === undefined) {
			return BlobCore.size(_this) - BlobCore.BYTE_LENGTH;
		}
		Blob.size(_this, size);
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
		BlobCore.initialize(blob, magic, size);
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
