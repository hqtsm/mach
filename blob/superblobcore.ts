import { type Const, constant, dataView, uint32BE } from '@hqtsm/struct';
import { type Blob, type BlobConstructor, templateBlob } from './blob.ts';
import { BlobCore } from './blobcore.ts';

/**
 * SuperBlobCore.
 *
 * @template B Blob type.
 * @template M Magic number.
 */
export interface SuperBlobCore<B extends BlobCore, M extends number>
	extends Blob<B, M> {
	/**
	 * SuperBlobCore constructor.
	 */
	readonly constructor: Omit<SuperBlobCoreConstructor<B, M>, 'new'>;

	/**
	 * Setup size and number of blobs in super blob.
	 *
	 * @param size Blob length.
	 * @param count Number of blobs.
	 */
	setup(size: number, count: number): void;

	/**
	 * Number of blobs in super blob.
	 *
	 * @returns Blob count.
	 */
	count(): number;

	/**
	 * Get type of index.
	 *
	 * @param index Index.
	 * @returns Type.
	 */
	type(index: number): number;

	/**
	 * Get blob at index.
	 *
	 * @param index Index.
	 * @returns Blob or null if no offset in index.
	 */
	blob(index: number): Const<BlobCore> | null;

	/**
	 * Find blob by type.
	 *
	 * @param type Index type.
	 * @returns First match or null.
	 */
	find(type: number): Const<BlobCore> | null;
}

/**
 * SuperBlobCore constructor.
 *
 * @template B Blob type.
 * @template M Magic number.
 */
export interface SuperBlobCoreConstructor<
	B extends BlobCore,
	M extends number,
> extends Omit<BlobConstructor<B, M>, 'new'> {
	/**
	 * SuperBlobCore constructor.
	 */
	new (
		...args: ConstructorParameters<BlobConstructor<B, M>>
	): SuperBlobCore<B, M>;

	/**
	 * SuperBlobCore prototype.
	 */
	readonly prototype: SuperBlobCore<B, M>;

	/**
	 * SuperBlobCore maker.
	 */
	readonly Maker: SuperBlobCoreMakerConstructor<B, M>;
}

/**
 * SuperBlobCore maker.
 *
 * @template B Blob type.
 * @template M Magic number.
 */
export interface SuperBlobCoreMaker<B extends BlobCore, M extends number> {
	/**
	 * Maker constructor.
	 */
	constructor: Omit<SuperBlobCoreMakerConstructor<B, M>, 'new'>;

	/**
	 * Add blob to super blob, by reference.
	 *
	 * @param type Index type.
	 * @param blob Blob.
	 */
	add(type: number, blob: BlobCore): void;

	/**
	 * Copy blobs to super blob, by value.
	 *
	 * @param blobs Blobs.
	 */
	add(blobs: SuperBlobCore<B, M>): void;

	/**
	 * Copy blobs to super blob, by value.
	 *
	 * @param maker Maker.
	 */
	add(maker: SuperBlobCoreMaker<B, M>): void;

	/**
	 * Check if super blob contains type.
	 *
	 * @param type Index type.
	 * @returns Is contained.
	 */
	contains(type: number): boolean;

	/**
	 * Get blob by type.
	 *
	 * @param type Index type.
	 * @returns Blob or null if not found.
	 */
	get(type: number): BlobCore | null;

	/**
	 * Size of super blob.
	 *
	 * @param sizes Iterable of additional blob sizes.
	 * @param size1 Additional blob sizes.
	 * @returns Byte length.
	 */
	size(sizes?: Iterable<number>, ...size1: number[]): number;

	/**
	 * Create the super blob.
	 *
	 * @returns SuperBlob.
	 */
	make(): SuperBlobCore<B, M>;
}

/**
 * Maker constructor.
 *
 * @template B Blob type.
 * @template M Magic number.
 */
export interface SuperBlobCoreMakerConstructor<
	B extends BlobCore,
	M extends number,
> {
	/**
	 * Maker constructor.
	 */
	new (): SuperBlobCoreMaker<B, M>;

	/**
	 * Maker prototype.
	 */
	readonly prototype: SuperBlobCoreMaker<B, M>;
}

/**
 * SuperBlobCore constructor.
 *
 * @template B Blob type.
 * @template M Magic number.
 * @param Class Blob class.
 * @param magic Type magic number.
 * @returns SuperBlobCore constructor.
 */
export function templateSuperBlobCore<
	B extends BlobCore,
	M extends number,
>(
	Class: () => Omit<SuperBlobCoreConstructor<B, M>, 'new'> & {
		new (
			...args: ConstructorParameters<SuperBlobCoreConstructor<B, M>>
		): SuperBlobCore<B, M>;
	},
	magic: M,
): SuperBlobCoreConstructor<B, M> {
	type _SuperBlobCore = SuperBlobCore<B, M>;
	type _Maker = SuperBlobCoreMaker<B, M>;

	return class SuperBlobCore extends templateBlob(Class, magic) {
		declare public readonly ['constructor']: Omit<
			typeof SuperBlobCore,
			'new'
		>;

		/**
		 * Number of blobs in super blob.
		 */
		declare private mCount: number;

		public setup(size: number, count: number): void {
			this.initializeLength(size);
			this.mCount = count;
		}

		public count(): number {
			return this.mCount;
		}

		public type(index: number): number {
			index = (+index || 0) - (index % 1 || 0);
			return dataView(this.buffer).getUint32(
				this.byteOffset + 12 + 8 * index,
			);
		}

		public blob(index: number): Const<BlobCore> | null {
			index = (+index || 0) - (index % 1 || 0);
			const offset = dataView(this.buffer).getUint32(
				this.byteOffset + 16 + 8 * index,
			);
			return offset ? this.at(BlobCore, offset) : null;
		}

		public find(type: number): Const<BlobCore> | null {
			const count = this.mCount;
			for (let i = 0; i < count; i++) {
				if (this.type(i) === type) {
					return this.blob(i);
				}
			}
			return null;
		}

		public static Maker = class Maker implements _Maker {
			declare public readonly ['constructor']: Omit<
				typeof Maker,
				'new'
			>;

			/**
			 * Blobs in super blob.
			 */
			private readonly mPieces = new Map<number, BlobCore>();

			public add(
				type: number | _SuperBlobCore | _Maker,
				blob?: BlobCore,
			): void {
				if (blob !== undefined) {
					this.mPieces.set(
						type as number,
						new BlobCore(
							blob.buffer,
							blob.byteOffset,
							blob.littleEndian,
						),
					);
					return;
				}

				if ('mPieces' in (type as Maker)) {
					for (const [t, b] of (type as Maker).mPieces) {
						this.add(t, b.clone());
					}
					return;
				}

				const count = (type as SuperBlobCore).count();
				for (let i = 0; i < count; i++) {
					this.add(
						(type as SuperBlobCore).type(i),
						(type as SuperBlobCore).blob(i)!.clone(),
					);
				}
			}

			public contains(type: number): boolean {
				return this.mPieces.has(type);
			}

			public get(type: number): BlobCore | null {
				return this.mPieces.get(type) || null;
			}

			public size(sizes?: Iterable<number>, ...size1: number[]): number {
				const SuperBlobCore = Class();
				let count = 0;
				let total = 0;
				for (const [, blob] of this.mPieces) {
					count++;
					total += blob.length();
				}
				if (sizes) {
					for (const s of sizes) {
						count++;
						total += s;
					}
				}
				for (const s of size1) {
					count++;
					total += s;
				}
				return SuperBlobCore.BYTE_LENGTH + count * 8 + total;
			}

			public make(): _SuperBlobCore {
				const SuperBlobCore = Class();
				const { mPieces } = this;
				const size = this.size();
				const count = mPieces.size;
				const buffer = new ArrayBuffer(size);
				const data = new Uint8Array(buffer);
				const view = dataView(buffer);
				const sb = new SuperBlobCore(buffer);
				sb.setup(size, count);
				let o1 = SuperBlobCore.BYTE_LENGTH;
				let o2 = o1 + count * 8;
				const types = [...mPieces.keys()].sort((a, b) => a - b);
				for (const type of types) {
					view.setUint32(o1, type);
					o1 += 4;
					view.setUint32(o1, o2);
					o1 += 4;
					const p = mPieces.get(type)!;
					const { buffer, byteOffset } = p;
					const l = p.length();
					data.set(new Uint8Array(buffer, byteOffset, l), o2);
					o2 += l;
				}
				return sb;
			}
		};

		static {
			uint32BE(this, 'mCount' as never);
			constant(this, 'BYTE_LENGTH');
		}
	};
}
