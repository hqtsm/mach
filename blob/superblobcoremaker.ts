import type { Class } from '@hqtsm/class';
import { dataView } from '@hqtsm/struct';
import { BlobCore } from './blobcore.ts';
import { SuperBlob } from './superblob.ts';

/**
 * SuperBlob core maker.
 */
export class SuperBlobCoreMaker {
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
		if (blob !== undefined) {
			this.mPieces.set(
				type as number,
				new BlobCore(blob.buffer, blob.byteOffset, blob.littleEndian),
			);
			return;
		}

		if ('mPieces' in (type as SuperBlobCoreMaker)) {
			for (const [t, b] of (type as SuperBlobCoreMaker).mPieces) {
				this.add(t, b.clone());
			}
			return;
		}

		const count = (type as SuperBlob).count();
		for (let i = 0; i < count; i++) {
			this.add(
				(type as SuperBlob).type(i),
				(type as SuperBlob).blob(i)!.clone(),
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
	public size(sizes?: Iterable<number>, ...size1: number[]): number {
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
		return SuperBlob.BYTE_LENGTH + count * 8 + total;
	}

	/**
	 * Create the super blob.
	 *
	 * @returns SuperBlob.
	 */
	public make(): SuperBlob {
		const { mPieces } = this;
		const size = this.size();
		const count = mPieces.size;
		const buffer = new ArrayBuffer(size);
		const data = new Uint8Array(buffer);
		const view = dataView(buffer);
		const sb = new this.constructor.SuperBlob(buffer);
		sb.setup(size, count);
		let o1 = SuperBlob.BYTE_LENGTH;
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

	/**
	 * SuperBlob class.
	 */
	public static readonly SuperBlob = SuperBlob;
}
