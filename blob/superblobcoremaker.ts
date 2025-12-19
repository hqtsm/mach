import { type Class, type Concrete, constant, toStringTag } from '@hqtsm/class';
import { BlobCore } from './blobcore.ts';
import { SuperBlob } from './superblob.ts';
import { SuperBlobCore } from './superblobcore.ts';
import { SuperBlobCoreIndex } from './superblobcoreindex.ts';

/**
 * SuperBlob core maker.
 */
export abstract class SuperBlobCoreMaker {
	declare public readonly ['constructor']: Class<typeof SuperBlobCoreMaker>;

	/**
	 * Blobs in super blob.
	 */
	private readonly mPieces = new Map<number, BlobCore>();

	/**
	 * Add blob to super blob, by reference.
	 *
	 * @param _this This.
	 * @param type Index type.
	 * @param blob Blob.
	 */
	public static add(
		_this: SuperBlobCoreMaker,
		type: number,
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
		type: number | SuperBlob | SuperBlobCoreMaker,
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
	public static contains(_this: SuperBlobCoreMaker, type: number): boolean {
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
		type: number,
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
		sizes: Iterable<number>,
		...size1: number[]
	): number {
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
	public static make<
		T extends
			& {
				readonly SuperBlob:
					& Concrete<typeof SuperBlob>
					& typeof SuperBlob;
			}
			& typeof SuperBlobCoreMaker,
	>(this: T, _this: T['prototype']): T['SuperBlob']['prototype'] {
		const { mPieces } = _this;
		const count = mPieces.size;
		const total = SuperBlobCoreMaker.size(_this, []);
		const buffer = new ArrayBuffer(total);
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
		return result;
	}

	/**
	 * SuperBlob class.
	 */
	public static readonly SuperBlob = SuperBlob;

	static {
		toStringTag(this, 'SuperBlobCoreMaker');
		constant(this, 'SuperBlob');
	}
}
