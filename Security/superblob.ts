import { type Concrete, constant, toStringTag } from '@hqtsm/class';
import {
	type Arr,
	array,
	type ArrayBufferType,
	member,
	Struct,
	uint32BE,
} from '@hqtsm/struct';
import {
	Security_Blob,
	Security_BlobCore,
	type Security_BlobCore_Offset,
} from './blob.ts';
import type { bool, uint } from '../libc/c.ts';
import { ENOMEM } from '../libc/errno.ts';
import type { size_t } from '../libc/stddef.ts';
import type { uint32_t } from '../libc/stdint.ts';
import { malloc } from '../libc/stdlib.ts';
import type { Security_Endian } from './endian.ts';
import { Security_UnixError } from './errors.ts';

/**
 * SuperBlobCore Type.
 */
export type Security_SuperBlobCore_Type = uint32_t;

/**
 * SuperBlobCore Offset.
 */
export type Security_SuperBlobCore_Offset = Security_BlobCore_Offset;

/**
 * Super blob index entry.
 *
 * @template TArrayBuffer Buffer type.
 */
export class Security_SuperBlobCore_Index<
	TArrayBuffer extends ArrayBufferLike = ArrayBufferLike,
> extends Struct<TArrayBuffer> {
	/**
	 * Blob type.
	 */
	declare public type: Security_Endian<Security_SuperBlobCore_Type>;

	/**
	 * Blob offset.
	 */
	declare public offset: Security_Endian<Security_SuperBlobCore_Offset>;

	static {
		toStringTag(this, 'Security_SuperBlobCore_Index');
		uint32BE(this, 'type');
		uint32BE(this, 'offset');
		constant(this, 'BYTE_LENGTH');
	}
}

/**
 * Multiple Blobs wrapped in a single indexed blob.
 *
 * @template TArrayBuffer Buffer type.
 */
export abstract class Security_SuperBlobCore<
	TArrayBuffer extends ArrayBufferLike = ArrayBufferLike,
> extends Security_Blob<TArrayBuffer> {
	/**
	 * Setup size and number of blobs in super blob.
	 *
	 * @param _this This.
	 * @param size Blob length.
	 * @param count Number of blobs.
	 */
	public static setup(
		_this: Security_SuperBlobCore,
		size: size_t,
		count: uint,
	): void {
		Security_SuperBlobCore.initializeSize.call(this, _this, size);
		_this.mCount = count;
	}

	/**
	 * Number of blobs in super blob.
	 *
	 * @param _this This.
	 * @returns Blob count.
	 */
	public static count(_this: Security_SuperBlobCore): uint {
		return _this.mCount;
	}

	/**
	 * Get type of index.
	 *
	 * @param _this This.
	 * @param n Index.
	 * @returns Type.
	 */
	public static type(_this: Security_SuperBlobCore, n: uint): uint {
		n >>>= 0;
		return _this.mIndex[n].type;
	}

	/**
	 * Get blob at index.
	 *
	 * @template T This type.
	 * @param _this This.
	 * @param n Index.
	 * @returns Blob or null if no offset in index.
	 */
	public static blob<T extends Security_SuperBlobCore>(
		_this: T,
		n: uint,
	): Security_BlobCore<ArrayBufferType<T>> | null {
		n >>>= 0;
		const { offset } = _this.mIndex[n];
		return offset
			? Security_SuperBlobCore.at(_this, Security_BlobCore, offset)
			: null;
	}

	/**
	 * Find blob by type.
	 *
	 * @template T This type.
	 * @param _this This.
	 * @param type Index type.
	 * @returns First match or null.
	 */
	public static find<T extends Security_SuperBlobCore>(
		_this: T,
		type: uint,
	): Security_BlobCore<ArrayBufferType<T>> | null {
		type >>>= 0;
		const { mCount, mIndex } = _this;
		for (let i = 0; i < mCount; i++) {
			const index = mIndex[i];
			if (index.type === type) {
				const { offset } = index;
				return offset
					? Security_SuperBlobCore.at(
						_this,
						Security_BlobCore,
						offset,
					)
					: null;
			}
		}
		return null;
	}

	/**
	 * Number of blobs in super blob.
	 */
	declare private mCount: Security_Endian<uint32_t>;

	/**
	 * Data of payload (only).
	 */
	declare private readonly mIndex: Arr<
		Security_SuperBlobCore_Index<TArrayBuffer>
	>;

	static {
		toStringTag(this, 'Security_SuperBlobCore');
		uint32BE(this, 'mCount' as never);
		member(array(Security_SuperBlobCore_Index, 0), this, 'mIndex' as never);
		constant(this, 'BYTE_LENGTH');
	}
}

/**
 * SuperBlobCore maker blob map.
 */
export type Security_SuperBlobCore_Maker_BlobMap = Map<
	Security_SuperBlobCore_Type,
	Security_BlobCore
>;

/**
 * SuperBlobCore_Maker template.
 */
export type Security_Template_SuperBlobCore_Maker =
	& {
		readonly SuperBlob:
			& Concrete<typeof Security_SuperBlobCore<ArrayBuffer>>
			& typeof Security_SuperBlobCore<ArrayBuffer>;
	}
	& typeof Security_SuperBlobCore_Maker;

/**
 * SuperBlob core maker.
 */
export abstract class Security_SuperBlobCore_Maker {
	/**
	 * SuperBlob class.
	 */
	public static readonly SuperBlob: typeof Security_SuperBlobCore<
		ArrayBuffer
	> = Security_SuperBlobCore;

	/**
	 * Add blob to super blob, by reference.
	 *
	 * @param _this This.
	 * @param type Index type.
	 * @param blob Blob.
	 */
	public static add(
		_this: Security_SuperBlobCore_Maker,
		type: Security_SuperBlobCore_Type,
		blob: Security_BlobCore,
	): void;

	/**
	 * Copy blobs to super blob, by value.
	 *
	 * @param _this This.
	 * @param blobs Blobs.
	 */
	public static add(
		_this: Security_SuperBlobCore_Maker,
		blobs: Security_SuperBlob,
	): void;

	/**
	 * Copy blobs to super blob, by value.
	 *
	 * @param _this This.
	 * @param maker Maker.
	 */
	public static add(
		_this: Security_SuperBlobCore_Maker,
		maker: Security_SuperBlobCore_Maker,
	): void;

	/**
	 * Add a blob to super blob.
	 *
	 * @param _this This.
	 * @param type Type, blobs, or marker.
	 * @param blob Blob if a type else undefined.
	 */
	public static add(
		_this: Security_SuperBlobCore_Maker,
		type:
			| Security_SuperBlobCore_Type
			| Security_SuperBlob
			| Security_SuperBlobCore_Maker,
		blob?: Security_BlobCore,
	): void {
		if (typeof type === 'number') {
			_this.mPieces.set(
				type,
				new Security_BlobCore(
					blob!.buffer,
					blob!.byteOffset,
					blob!.littleEndian,
				),
			);
			return;
		}

		if ('mPieces' in type) {
			for (const [t, b] of type.mPieces) {
				Security_SuperBlobCore_Maker.add(
					_this,
					t,
					Security_BlobCore.clone(b)!,
				);
			}
			return;
		}

		const mIndex = type['mIndex'];
		const mCount = type['mCount'];
		for (let ix = 0; ix < mCount; ix++) {
			Security_SuperBlobCore_Maker.add(
				_this,
				mIndex[ix].type,
				Security_BlobCore.clone(Security_SuperBlob.blob(type, ix)!)!,
			);
		}
	}

	/**
	 * Check if super blob contains type.
	 *
	 * @param _this This.
	 * @param type Index type.
	 * @returns Is contained.
	 */
	public static contains(
		_this: Security_SuperBlobCore_Maker,
		type: Security_SuperBlobCore_Type,
	): bool {
		return _this.mPieces.has(type);
	}

	/**
	 * Get blob by type.
	 *
	 * @template T This type.
	 * @param _this This.
	 * @param type Index type.
	 * @returns Blob or null if not found.
	 */
	public static get<T extends Security_SuperBlobCore_Maker>(
		_this: T,
		type: Security_SuperBlobCore_Type,
	): Security_BlobCore<ArrayBufferType<T>> | null {
		return _this.mPieces.get(type) || null;
	}

	/**
	 * Size of super blob.
	 *
	 * @param _this This.
	 * @param sizes Iterable of additional blob sizes.
	 * @param size1 Additional blob sizes.
	 * @returns Byte length.
	 */
	public static size(
		_this: Security_SuperBlobCore_Maker,
		sizes: Iterable<size_t>,
		...size1: size_t[]
	): size_t {
		let count = 0;
		let total = 0;
		for (const blob of _this.mPieces.values()) {
			count++;
			total += Security_BlobCore.size(blob);
		}
		for (const s of sizes) {
			count++;
			total += s;
		}
		for (const s of size1) {
			count++;
			total += s;
		}
		return Security_SuperBlobCore.BYTE_LENGTH +
			count * Security_SuperBlobCore_Index.BYTE_LENGTH +
			total;
	}

	/**
	 * Create the super blob.
	 *
	 * @template TSuperBlobCore_Maker Maker type.
	 * @param this Maker instance.
	 * @param _this This.
	 * @returns SuperBlob.
	 */
	public static make<
		TSuperBlobCore_Maker extends Security_Template_SuperBlobCore_Maker,
	>(
		this: TSuperBlobCore_Maker,
		_this: InstanceType<TSuperBlobCore_Maker>,
	): InstanceType<TSuperBlobCore_Maker['SuperBlob']> {
		const { mPieces } = _this;
		const count = mPieces.size;
		const total = Security_SuperBlobCore_Maker.size(_this, []);
		const buffer = malloc(total);
		if (!buffer) {
			Security_UnixError.throwMe(ENOMEM);
		}
		const data = new Uint8Array(buffer);
		const result = new this.SuperBlob(buffer);
		const mIndex = result['mIndex'];
		this.SuperBlob.setup(result, total, count);
		let pc = Security_SuperBlobCore.BYTE_LENGTH +
			count * Security_SuperBlobCore_Index.BYTE_LENGTH;
		let n = 0;
		for (const type of [...mPieces.keys()].sort((a, b) => a - b)) {
			const index = mIndex[n];
			index.type = type;
			index.offset = pc;
			const p = mPieces.get(type)!;
			const l = Security_BlobCore.size(p);
			data.set(new Uint8Array(p.buffer, p.byteOffset, l), pc);
			pc += l;
			n++;
		}
		return result as InstanceType<TSuperBlobCore_Maker['SuperBlob']>;
	}

	/**
	 * Blobs in super blob.
	 */
	private readonly mPieces: Security_SuperBlobCore_Maker_BlobMap = new Map();

	static {
		toStringTag(this, 'Security_SuperBlobCore_Maker');
		constant(this, 'SuperBlob');
	}
}

/**
 * A generic SuperBlob base.
 *
 * @template TArrayBuffer Array buffer type.
 */
export abstract class Security_SuperBlob<
	TArrayBuffer extends ArrayBufferLike = ArrayBufferLike,
> extends Security_SuperBlobCore<TArrayBuffer> {
	static {
		toStringTag(this, 'Security_SuperBlob');
	}
}

/**
 * SuperBlob maker.
 */
export abstract class Security_SuperBlob_Maker
	extends Security_SuperBlobCore_Maker {
	public static override readonly SuperBlob: typeof Security_SuperBlob<
		ArrayBuffer
	> = Security_SuperBlob;

	static {
		toStringTag(this, 'Security_SuperBlob_Maker');
		constant(this, 'SuperBlob');
	}
}
