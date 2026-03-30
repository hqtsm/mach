import { type Concrete, constant, toStringTag } from '@hqtsm/class';
import { type Arr, array, member, Struct, uint32BE } from '@hqtsm/struct';
import { Blob, BlobCore, type BlobCoreOffset } from './blob.ts';
import type { bool, uint } from '../libc/c.ts';
import { ENOMEM } from '../libc/errno.ts';
import type { size_t } from '../libc/stddef.ts';
import type { uint32_t } from '../libc/stdint.ts';
import { malloc } from '../libc/stdlib.ts';
import type { Endian } from './endian.ts';
import { UnixError } from './errors.ts';

/**
 * SuperBlobCore offset.
 */
export type SuperBlobCoreOffset = BlobCoreOffset;

/**
 * SuperBlobCore type.
 */
export type SuperBlobCoreType = uint32_t;

/**
 * Super blob index entry.
 *
 * @template TArrayBuffer Buffer type.
 */
export class SuperBlobCoreIndex<
	TArrayBuffer extends ArrayBufferLike = ArrayBufferLike,
> extends Struct<TArrayBuffer> {
	/**
	 * Blob type.
	 */
	declare public type: Endian<SuperBlobCoreType>;

	/**
	 * Blob offset.
	 */
	declare public offset: Endian<SuperBlobCoreOffset>;

	static {
		toStringTag(this, 'SuperBlobCoreIndex');
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
export abstract class SuperBlobCore<
	TArrayBuffer extends ArrayBufferLike = ArrayBufferLike,
> extends Blob<TArrayBuffer> {
	/**
	 * Setup size and number of blobs in super blob.
	 *
	 * @param _this This.
	 * @param size Blob length.
	 * @param count Number of blobs.
	 */
	public static setup(_this: SuperBlobCore, size: size_t, count: uint): void {
		SuperBlobCore.initializeSize.call(this, _this, size);
		_this.mCount = count;
	}

	/**
	 * Number of blobs in super blob.
	 *
	 * @param _this This.
	 * @returns Blob count.
	 */
	public static count(_this: SuperBlobCore): uint {
		return _this.mCount;
	}

	/**
	 * Get type of index.
	 *
	 * @param _this This.
	 * @param n Index.
	 * @returns Type.
	 */
	public static type(_this: SuperBlobCore, n: uint): uint {
		n >>>= 0;
		return _this.mIndex[n].type;
	}

	/**
	 * Get blob at index.
	 *
	 * @param _this This.
	 * @param n Index.
	 * @returns Blob or null if no offset in index.
	 */
	public static blob(_this: SuperBlobCore, n: uint): BlobCore | null {
		n >>>= 0;
		const { offset } = _this.mIndex[n];
		return offset ? SuperBlobCore.at(_this, BlobCore, offset) : null;
	}

	/**
	 * Find blob by type.
	 *
	 * @param _this This.
	 * @param type Index type.
	 * @returns First match or null.
	 */
	public static find(_this: SuperBlobCore, type: uint): BlobCore | null {
		type >>>= 0;
		const { mCount, mIndex } = _this;
		for (let i = 0; i < mCount; i++) {
			const index = mIndex[i];
			if (index.type === type) {
				const { offset } = index;
				return offset
					? SuperBlobCore.at(_this, BlobCore, offset)
					: null;
			}
		}
		return null;
	}

	/**
	 * Number of blobs in super blob.
	 */
	declare private mCount: Endian<uint32_t>;

	/**
	 * Data of payload (only).
	 */
	declare private readonly mIndex: Arr<SuperBlobCoreIndex<TArrayBuffer>>;

	static {
		toStringTag(this, 'SuperBlobCore');
		uint32BE(this, 'mCount' as never);
		member(array(SuperBlobCoreIndex, 0), this, 'mIndex' as never);
		constant(this, 'BYTE_LENGTH');
	}
}

/**
 * SuperBlobCore maker blob map.
 */
export type SuperBlobCoreMakerBlobMap = Map<SuperBlobCoreType, BlobCore>;

/**
 * SuperBlobCoreMaker template.
 */
export type TemplateSuperBlobCoreMaker =
	& {
		readonly SuperBlob:
			& Concrete<typeof SuperBlobCore<ArrayBuffer>>
			& typeof SuperBlobCore<ArrayBuffer>;
	}
	& typeof SuperBlobCoreMaker;

/**
 * SuperBlob core maker.
 */
export abstract class SuperBlobCoreMaker {
	/**
	 * SuperBlob class.
	 */
	public static readonly SuperBlob: typeof SuperBlobCore<ArrayBuffer> =
		SuperBlobCore;

	/**
	 * Add blob to super blob, by reference.
	 *
	 * @param _this This.
	 * @param type Index type.
	 * @param blob Blob.
	 */
	public static add(
		_this: SuperBlobCoreMaker,
		type: SuperBlobCoreType,
		blob: BlobCore,
	): void;

	/**
	 * Copy blobs to super blob, by value.
	 *
	 * @param _this This.
	 * @param blobs Blobs.
	 */
	public static add(
		_this: SuperBlobCoreMaker,
		blobs: SuperBlob,
	): void;

	/**
	 * Copy blobs to super blob, by value.
	 *
	 * @param _this This.
	 * @param maker Maker.
	 */
	public static add(
		_this: SuperBlobCoreMaker,
		maker: SuperBlobCoreMaker,
	): void;

	/**
	 * Add a blob to super blob.
	 *
	 * @param _this This.
	 * @param type Type, blobs, or marker.
	 * @param blob Blob if a type else undefined.
	 */
	public static add(
		_this: SuperBlobCoreMaker,
		type: SuperBlobCoreType | SuperBlob | SuperBlobCoreMaker,
		blob?: BlobCore,
	): void {
		if (typeof type === 'number') {
			_this.mPieces.set(
				type,
				new BlobCore(
					blob!.buffer,
					blob!.byteOffset,
					blob!.littleEndian,
				),
			);
			return;
		}

		if ('mPieces' in type) {
			for (const [t, b] of type.mPieces) {
				SuperBlobCoreMaker.add(_this, t, BlobCore.clone(b)!);
			}
			return;
		}

		const mIndex = type['mIndex'];
		const mCount = type['mCount'];
		for (let ix = 0; ix < mCount; ix++) {
			SuperBlobCoreMaker.add(
				_this,
				mIndex[ix].type,
				BlobCore.clone(SuperBlob.blob(type, ix)!)!,
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
		_this: SuperBlobCoreMaker,
		type: SuperBlobCoreType,
	): bool {
		return _this.mPieces.has(type);
	}

	/**
	 * Get blob by type.
	 *
	 * @param _this This.
	 * @param type Index type.
	 * @returns Blob or null if not found.
	 */
	public static get(
		_this: SuperBlobCoreMaker,
		type: SuperBlobCoreType,
	): BlobCore | null {
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
		_this: SuperBlobCoreMaker,
		sizes: Iterable<size_t>,
		...size1: size_t[]
	): size_t {
		let count = 0;
		let total = 0;
		for (const blob of _this.mPieces.values()) {
			count++;
			total += BlobCore.size(blob);
		}
		for (const s of sizes) {
			count++;
			total += s;
		}
		for (const s of size1) {
			count++;
			total += s;
		}
		return SuperBlobCore.BYTE_LENGTH +
			count * SuperBlobCoreIndex.BYTE_LENGTH +
			total;
	}

	/**
	 * Create the super blob.
	 *
	 * @param this Maker instance.
	 * @param _this This.
	 * @returns SuperBlob.
	 */
	public static make<T extends TemplateSuperBlobCoreMaker>(
		this: T,
		_this: InstanceType<T>,
	): InstanceType<T['SuperBlob']> {
		const { mPieces } = _this;
		const count = mPieces.size;
		const total = SuperBlobCoreMaker.size(_this, []);
		const buffer = malloc(total);
		if (!buffer) {
			UnixError.throwMe(ENOMEM);
		}
		const data = new Uint8Array(buffer);
		const result = new this.SuperBlob(buffer);
		const mIndex = result['mIndex'];
		this.SuperBlob.setup(result, total, count);
		let pc = SuperBlobCore.BYTE_LENGTH +
			count * SuperBlobCoreIndex.BYTE_LENGTH;
		let n = 0;
		for (const type of [...mPieces.keys()].sort((a, b) => a - b)) {
			const index = mIndex[n];
			index.type = type;
			index.offset = pc;
			const p = mPieces.get(type)!;
			const l = BlobCore.size(p);
			data.set(new Uint8Array(p.buffer, p.byteOffset, l), pc);
			pc += l;
			n++;
		}
		return result as InstanceType<T['SuperBlob']>;
	}

	/**
	 * Blobs in super blob.
	 */
	private readonly mPieces: SuperBlobCoreMakerBlobMap = new Map();

	static {
		toStringTag(this, 'SuperBlobCoreMaker');
		constant(this, 'SuperBlob');
	}
}

/**
 * A generic SuperBlob base.
 *
 * @template TArrayBuffer Array buffer type.
 */
export abstract class SuperBlob<
	TArrayBuffer extends ArrayBufferLike = ArrayBufferLike,
> extends SuperBlobCore<TArrayBuffer> {
	static {
		toStringTag(this, 'SuperBlob');
	}
}

/**
 * SuperBlob maker.
 */
export abstract class SuperBlobMaker extends SuperBlobCoreMaker {
	public static override readonly SuperBlob: typeof SuperBlob<ArrayBuffer> =
		SuperBlob;

	static {
		toStringTag(this, 'SuperBlobMaker');
		constant(this, 'SuperBlob');
	}
}
