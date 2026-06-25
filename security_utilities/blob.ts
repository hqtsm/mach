import { type Concrete, constant, toStringTag } from '@hqtsm/class';
import { PLData } from '@hqtsm/plist';
import {
	type Arr,
	array,
	type ArrayBufferPointer,
	Int8Ptr,
	member,
	Ptr,
	Struct,
	uint32BE,
	Uint8Ptr,
} from '@hqtsm/struct';
import type { CFDataRef } from '../CoreFoundation/CFData.ts';
import {
	type ArrayBufferLikeData,
	pointerBytes,
	viewBytes,
} from '../helpers/memory.ts';
import type { Reader } from '../helpers/reader.ts';
import { CSMAGIC_BLOBWRAPPER } from '../kern/cs_blobs.ts';
import { EINVAL, ENOMEM } from '../libc/errno.ts';
import type { _const, bool, int, uchar } from '../libc/c.ts';
import type { size_t } from '../libc/stddef.ts';
import type { uint32_t, uint8_t } from '../libc/stdint.ts';
import { malloc } from '../libc/stdlib.ts';
import { errSecAllocate } from '../Security/SecBase.ts';
import type { Security_Endian } from './endian.ts';
import { Security_MacOSError, Security_UnixError } from './errors.ts';

/**
 * BlobCore Offset.
 */
export type Security_BlobCore_Offset = uint32_t;

/**
 * BlobCore Magic number.
 */
export type Security_BlobCore_Magic = uint32_t;

/**
 * BlobCore BlobType.
 *
 * @template TArrayBuffer Buffer type.
 */
export type Security_BlobCore_BlobType<
	TArrayBuffer extends ArrayBufferLike = ArrayBufferLike,
> =
	& { readonly typeMagic: Security_BlobCore_Magic }
	& typeof Security_BlobCore<TArrayBuffer>;

/**
 * Polymorphic memory blobs with magics numbers.
 *
 * @template TArrayBuffer Buffer type.
 */
export class Security_BlobCore<
	TArrayBuffer extends ArrayBufferLike = ArrayBufferLike,
> extends Struct<TArrayBuffer | ArrayBuffer> {
	/**
	 * Magic number.
	 *
	 * @param _this This.
	 * @returns Magic number.
	 */
	public static magic(_this: Security_BlobCore): Security_BlobCore_Magic {
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
	public static size(_this: Security_BlobCore): size_t;

	/**
	 * Set blob length.
	 * By default includes magic and length.
	 * Child classes may redefine this to be a smaller area.
	 *
	 * @param _this This.
	 * @param size Byte length.
	 */
	public static size(_this: Security_BlobCore, size: size_t): void;

	/**
	 * Get or set blob length.
	 *
	 * @param _this This.
	 * @param size Byte length to set or undefined to get.
	 * @returns Byte length on get or undefined on set.
	 */
	public static size(_this: Security_BlobCore, size?: size_t): size_t | void {
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
	public static initialize(
		_this: Security_BlobCore,
		magic: Security_BlobCore_Magic,
		length: size_t = 0,
	): void {
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
		_this: Security_BlobCore,
		magic: Security_BlobCore_Magic,
		minSize?: size_t,
		maxSize?: size_t,
		context?: { errno: int },
	): bool {
		const length = _this.mLength;
		if (magic && magic !== _this.mMagic) {
			if (context) context.errno = EINVAL;
			return false;
		}
		if (length < (minSize || Security_BlobCore.BYTE_LENGTH)) {
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
		_this: Security_BlobCore,
		Type: new (
			buffer: ArrayBufferLike,
			byteOffset?: number,
			littleEndian?: boolean | null,
		) => T,
		offset: Security_BlobCore_Offset,
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
		_this: Security_BlobCore,
		offset: size_t,
		size: size_t,
	): bool {
		return (
			offset >= Security_BlobCore.BYTE_LENGTH &&
			size >= 0 &&
			(offset + size) <= Security_BlobCore.size(_this)
		);
	}

	/**
	 * Get string at offset.
	 *
	 * @param _this This.
	 * @param offset Byte offset.
	 * @returns String pointer if null terminated string or null.
	 */
	public static stringAt(
		_this: Security_BlobCore,
		offset: Security_BlobCore_Offset,
	): Int8Ptr | null {
		let length = Security_BlobCore.size(_this);
		if (offset >= 0 && offset < length) {
			const s = Security_BlobCore.at(_this, Int8Ptr, offset) as Int8Ptr;
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
	public static data(_this: Security_BlobCore): Ptr {
		return new Ptr(_this.buffer, _this.byteOffset, _this.littleEndian);
	}

	/**
	 * Clone blob.
	 *
	 * @param _this This.
	 * @returns Cloned blob.
	 */
	public static clone(
		_this: Security_BlobCore,
	): Security_BlobCore<ArrayBuffer> | null {
		const l = Security_BlobCore.size(_this);
		const b = malloc(l);
		if (b) {
			new Uint8Array(b).set(
				new Uint8Array(_this.buffer, _this.byteOffset, l),
			);
			return new Security_BlobCore(b, 0, _this.littleEndian);
		}
		Security_UnixError.throwMe(ENOMEM);
	}

	/**
	 * Inner byte data.
	 *
	 * @param _this This.
	 * @returns Uint8 byte array.
	 */
	public static innerData(_this: Security_BlobCore): _const<Arr<uint8_t>> {
		const o = Security_BlobCore.BYTE_LENGTH;
		const p = Security_BlobCore.at(_this, Uint8Ptr, o);
		return new (array(Uint8Ptr, Security_BlobCore.size(_this) - o))(
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
	public static is(
		this: Security_BlobCore_BlobType,
		_this: Security_BlobCore,
	): bool {
		return Security_BlobCore.magic(_this) === this.typeMagic;
	}

	/**
	 * Read blob from reader.
	 *
	 * @param reader Reader.
	 * @returns Blob or null if not enough data for header.
	 */
	public static async readBlob(
		reader: Reader,
		context?: { errno: int },
	): Promise<Security_BlobCore<ArrayBuffer> | null> {
		return await Security_BlobCore.readBlobInternal(
			reader,
			0,
			0,
			0,
			0,
			context,
		);
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
		offset: size_t,
		magic: uint32_t,
		minSize: size_t,
		maxSize: size_t,
		context?: { errno: int },
	): Promise<Security_BlobCore<ArrayBuffer> | null> {
		reader = reader.slice(offset);
		if (reader.size < 8) {
			return null;
		}
		const head = await reader.slice(0, 8).arrayBuffer();
		const header = new Security_BlobCore(head);
		if (
			!Security_BlobCore.validateBlob(
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
		return new Security_BlobCore(data);
	}

	/**
	 * Magic number.
	 */
	declare protected mMagic: Security_Endian<uint32_t>;

	/**
	 * Blob length.
	 */
	declare protected mLength: Security_Endian<uint32_t>;

	static {
		toStringTag(this, 'Security_BlobCore');
		uint32BE(this, 'mMagic' as never);
		uint32BE(this, 'mLength' as never);
		constant(this, 'BYTE_LENGTH');
	}
}

/**
 * Blob template.
 *
 * @template TArrayBuffer Buffer type.
 */
export type Security_Template_Blob<
	TArrayBuffer extends ArrayBufferLike = ArrayBufferLike,
> =
	& Concrete<typeof Security_Blob<TArrayBuffer>>
	& typeof Security_Blob<TArrayBuffer>;

/**
 * Polymorphic memory blob for magic number.
 *
 * @template TArrayBuffer Buffer type.
 */
export abstract class Security_Blob<
	TArrayBuffer extends ArrayBufferLike = ArrayBufferLike,
> extends Security_BlobCore<TArrayBuffer> {
	/**
	 * Initialize blob with length, using known type magic.
	 *
	 * @param _this This.
	 * @param size Length.
	 */
	public static initializeSize(_this: Security_Blob, size: size_t = 0): void {
		Security_BlobCore.initialize(_this, this.typeMagic, size);
	}

	/**
	 * Type magic number for this blob.
	 *
	 * @returns Type magic number.
	 */
	public static readonly typeMagic: Security_BlobCore_Magic = 0;

	/**
	 * Validate blob with length, using known type magic.
	 *
	 * @param _this This.
	 * @param context Context.
	 * @returns Is valid.
	 */
	public static validateBlobSize(
		_this: Security_Blob,
		context?: { errno: int },
	): bool;

	/**
	 * Validate blob with length, using known type magic.
	 *
	 * @param _this This.
	 * @param length Require exact length.
	 * @param context Context.
	 * @returns Is valid.
	 */
	public static validateBlobSize(
		_this: Security_Blob,
		length: size_t,
		context?: { errno: int },
	): bool;

	/**
	 * Validate blob with length, using known type magic.
	 *
	 * @param _this This.
	 * @param length Exact length or context.
	 * @param context Context.
	 * @returns Is valid.
	 */
	public static validateBlobSize(
		_this: Security_Blob,
		length?: size_t | { errno: int },
		context?: { errno: int },
	): bool {
		if (typeof length === 'number') {
			return (
				length >= _this.byteLength &&
				Security_Blob.validateBlobSize.call<
					typeof this,
					[typeof _this, typeof context],
					bool
				>(this, _this, context) &&
				_this.mLength === length
			);
		}
		return Security_BlobCore.validateBlob(
			_this,
			this.typeMagic,
			_this.byteLength,
			undefined,
			length,
		);
	}

	/**
	 * Cast blob to specific type.
	 *
	 * @template TBlob Blob type.
	 * @template TBlobCore Blob core type.
	 * @param this Blob class.
	 * @param blob Blob.
	 * @param context Context.
	 * @returns Cast blob or null.
	 */
	public static specific<
		TBlob extends Security_Template_Blob,
		TBlobCore extends Security_BlobCore,
	>(
		this: TBlob,
		blob: TBlobCore,
		context?: { errno: int },
	): (InstanceType<TBlob> & TBlobCore) | null {
		const p = new this(blob.buffer, blob.byteOffset, blob.littleEndian);
		return Security_Blob.validateBlobSize.call<
				typeof this,
				[typeof p, typeof context],
				bool
			>(this, p, context)
			? p as InstanceType<TBlob> & TBlobCore
			: null;
	}

	/**
	 * Wrap data into a new blob.
	 *
	 * @param content Data to wrap.
	 * @returns Blob data.
	 */
	public static blobify(content: ArrayBufferLikeData): CFDataRef {
		const { typeMagic } = this;
		const { BYTE_LENGTH } = Security_BlobCore;
		const view = viewBytes(content);
		const size = BYTE_LENGTH + view.byteLength;
		let data;
		try {
			data = new PLData(size);
		} catch (err) {
			if (!(err instanceof RangeError)) {
				throw err;
			}
		}
		if (!data) {
			Security_MacOSError.throwMe(errSecAllocate);
		}
		class B extends Security_Blob {
			public static override readonly typeMagic = typeMagic;
		}
		B.initializeSize(new B(data.buffer), size);
		new Uint8Array(data.buffer, BYTE_LENGTH).set(view);
		return data;
	}

	/**
	 * Clone blob.
	 *
	 * @template TBlob Blob type.
	 * @param this Blob class.
	 * @param _this This.
	 * @param context Context.
	 * @returns Cloned blob.
	 */
	public static override clone<TBlob extends Security_Template_Blob>(
		this: TBlob,
		_this: Security_Blob,
		context?: { errno: int },
	): (InstanceType<TBlob> & Security_Blob<ArrayBuffer>) | null {
		const c = Security_BlobCore.clone(_this);
		return c && Security_Blob.specific.call(
			this,
			c,
			context,
		) as (InstanceType<TBlob> & Security_Blob<ArrayBuffer>);
	}

	/**
	 * Read blob from reader.
	 *
	 * @template TBlob Blob type.
	 * @param this Blob class.
	 * @param reader Reader.
	 * @param context Context.
	 * @returns Blob or null if not valid.
	 */
	public static override async readBlob<TBlob extends Security_Template_Blob>(
		this: TBlob,
		reader: Reader,
		context?: { errno: int },
	): Promise<(InstanceType<TBlob> & Security_Blob<ArrayBuffer>) | null>;

	/**
	 * Read blob from reader.
	 *
	 * @template TBlob Blob type.
	 * @param this Blob class.
	 * @param reader Reader.
	 * @param offset Byte offset.
	 * @param maxSize Maximum size.
	 * @param context Context.
	 * @returns Blob or null if not valid.
	 */
	public static override async readBlob<TBlob extends Security_Template_Blob>(
		this: TBlob,
		reader: Reader,
		offset: size_t,
		maxSize?: size_t,
		context?: { errno: int },
	): Promise<(InstanceType<TBlob> & Security_Blob<ArrayBuffer>) | null>;

	/**
	 * Read blob from reader.
	 *
	 * @template TBlob Blob type.
	 * @param this Blob class.
	 * @param reader Reader.
	 * @param offset Byte offset or context.
	 * @param maxSize Maximum size.
	 * @param context Context.
	 * @returns Blob or null if not valid.
	 */
	public static override async readBlob<TBlob extends Security_Template_Blob>(
		this: TBlob,
		reader: Reader,
		offset?: size_t | { errno: int },
		maxSize?: size_t,
		context?: { errno: int },
	): Promise<(InstanceType<TBlob> & Security_Blob<ArrayBuffer>) | null> {
		if (typeof offset !== 'number') {
			context = offset;
			maxSize = offset = 0;
		}
		const p = await Security_BlobCore.readBlobInternal(
			reader,
			offset,
			this.typeMagic,
			0,
			maxSize || 0,
			context,
		);
		return p
			? Security_Blob.specific.call(
				this,
				p,
				context,
			) as ((InstanceType<TBlob> & Security_Blob<ArrayBuffer>) | null)
			: p;
	}

	static {
		toStringTag(this, 'Security_Blob');
		constant(this, 'BYTE_LENGTH');
		constant(this, 'typeMagic');
	}
}

/**
 * Generic blob wrapping arbitrary binary data.
 *
 * @template TArrayBuffer Array buffer type.
 */
export class Security_BlobWrapper<
	TArrayBuffer extends ArrayBufferLike = ArrayBufferLike,
> extends Security_Blob<TArrayBuffer> {
	public static override readonly typeMagic = CSMAGIC_BLOBWRAPPER;

	/**
	 * Wrap data into a new blob.
	 *
	 * @param length Length of data.
	 * @param magic Magic number.
	 * @returns Blob.
	 */
	public static alloc(
		length: size_t,
		magic?: Security_BlobCore_Magic,
	): Security_BlobWrapper<ArrayBuffer>;

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
		length: size_t,
		magic?: Security_BlobCore_Magic,
	): Security_BlobWrapper<ArrayBuffer>;

	/**
	 * Wrap data into a new blob.
	 *
	 * @param data Data to wrap.
	 * @param length Length of data.
	 * @param magic Magic number.
	 * @returns Blob.
	 */
	public static alloc(
		data: size_t | ArrayBufferPointer | ArrayBufferLike,
		length?: size_t,
		magic?: Security_BlobCore_Magic,
	): Security_BlobWrapper<ArrayBuffer> {
		const { BYTE_LENGTH } = Security_BlobWrapper;
		let view;
		let size = BYTE_LENGTH;
		if (typeof data === 'number') {
			size += data;
			magic = length;
		} else {
			view = pointerBytes(data, length!);
			size += view.byteLength;
		}
		magic ??= Security_BlobWrapper.typeMagic;
		const buffer = new ArrayBuffer(size);
		const blob = new Security_BlobWrapper(buffer);
		Security_BlobCore.initialize(blob, magic, size);
		if (view) {
			new Uint8Array(buffer, BYTE_LENGTH).set(view);
		}
		return blob;
	}

	/**
	 * Data of payload (only).
	 */
	declare public readonly dataArea: Arr<uchar>;

	/**
	 * Data of payload (only).
	 *
	 * @param _this This.
	 * @returns Data pointer.
	 */
	public static override data(_this: Security_BlobWrapper): Ptr {
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
	public static override size(_this: Security_BlobWrapper): size_t;

	/**
	 * Set blob length for full blob, including magic and length.
	 * Unchanged from parent.
	 *
	 * @param _this This.
	 * @param size Byte length.
	 */
	public static override size(
		_this: Security_BlobWrapper,
		size: size_t,
	): void;

	/**
	 * Get or set blob length.
	 *
	 * @param _this This.
	 * @param size Byte length to set or undefined to get.
	 * @returns Byte length on get or undefined on set.
	 */
	public static override size(
		_this: Security_BlobWrapper,
		size?: size_t,
	): size_t | void {
		if (size === undefined) {
			return Security_BlobCore.size(_this) -
				Security_BlobCore.BYTE_LENGTH;
		}
		Security_Blob.size(_this, size);
	}

	static {
		toStringTag(this, 'Security_BlobWrapper');
		member(array(Uint8Ptr, 0), this, 'dataArea');
		constant(this, 'BYTE_LENGTH');
		constant(this, 'typeMagic');
	}
}
