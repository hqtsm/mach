import { type Class, type Concrete, constant, toStringTag } from '@hqtsm/class';
import { BlobCore } from './blobcore.ts';
import { SuperBlob } from './superblob.ts';
import { SuperBlobCore } from './superblobcore.ts';
import { SuperBlobCoreIndex } from './superblobcoreindex.ts';

/**
 * Instance type for SuperBlobCoreMaker.
 *
 * @template T SuperBlobCoreMaker.
 */
export type SuperBlobCoreMakerThis<T extends SuperBlobCoreMaker> = {
	readonly constructor: {
		readonly SuperBlob: Concrete<T['constructor']['SuperBlob']>;
	};
} & T;

/**
 * Blob type for SuperBlobCoreMaker.
 *
 * @template T SuperBlobCoreMaker.
 */
export type SuperBlobCoreMakerBlobType<T extends SuperBlobCoreMaker> =
	T['constructor']['SuperBlob']['prototype'];

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
	 * @param type Index type.
	 * @param blob Blob.
	 */
	public add(type: number, blob: BlobCore): void;

	/**
	 * Copy blobs to super blob, by value.
	 *
	 * @param blobs Blobs.
	 */
	public add(blobs: SuperBlob): void;

	/**
	 * Copy blobs to super blob, by value.
	 *
	 * @param maker Maker.
	 */
	public add(maker: SuperBlobCoreMaker): void;

	/**
	 * Add a blob to super blob.
	 *
	 * @param type Type, blobs, or marker.
	 * @param blob Blob if a type else undefined.
	 */
	public add(
		type: number | SuperBlob | SuperBlobCoreMaker,
		blob?: BlobCore,
	): void {
		if (typeof type === 'number') {
			this.mPieces.set(
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
				SuperBlobCoreMaker.prototype.add.call<
					SuperBlobCoreMaker,
					[number, BlobCore],
					void
				>(
					this,
					t,
					BlobCore.clone(b)!,
				);
			}
			return;
		}

		const mIndex = type['mIndex'];
		const mCount = type['mCount'];
		for (let ix = 0; ix < mCount; ix++) {
			SuperBlobCoreMaker.prototype.add.call<
				SuperBlobCoreMaker,
				[number, BlobCore],
				void
			>(
				this,
				mIndex[ix].type,
				BlobCore.clone(SuperBlob.blob(type, ix)!)!,
			);
		}
	}

	/**
	 * Check if super blob contains type.
	 *
	 * @param type Index type.
	 * @returns Is contained.
	 */
	public contains(type: number): boolean {
		return this.mPieces.has(type);
	}

	/**
	 * Get blob by type.
	 *
	 * @param type Index type.
	 * @returns Blob or null if not found.
	 */
	public get(type: number): BlobCore | null {
		return this.mPieces.get(type) || null;
	}

	/**
	 * Size of super blob.
	 *
	 * @param sizes Iterable of additional blob sizes.
	 * @param size1 Additional blob sizes.
	 * @returns Byte length.
	 */
	public size(sizes: Iterable<number>, ...size1: number[]): number {
		let count = 0;
		let total = 0;
		for (const blob of this.mPieces.values()) {
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
	 * @returns SuperBlob.
	 */
	public make(
		this: SuperBlobCoreMakerThis<this>,
	): SuperBlobCoreMakerBlobType<this> {
		const { mPieces } = this;
		const count = mPieces.size;
		const total = SuperBlobCoreMaker.prototype.size.call(this, []);
		const buffer = new ArrayBuffer(total);
		const data = new Uint8Array(buffer);
		const result = new this.constructor.SuperBlob(buffer);
		const mIndex = result['mIndex'];
		this.constructor.SuperBlob.setup(result, total, count);
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
