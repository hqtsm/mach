import { dataView } from '@hqtsm/struct';
import { BlobCore } from './blobcore.ts';
import { SuperBlob } from './superblob.ts';

/**
 * SuperBlob maker.
 */
export class SuperBlobMaker {
	declare public readonly ['constructor']: Omit<typeof SuperBlobMaker, 'new'>;

	/**
	 * Blobs in super blob.
	 */
	readonly #pieces = new Map<number, BlobCore>();

	/**
	 * Add blob to super blob.
	 *
	 * @param type Index type.
	 * @param blob Blob.
	 */
	public add(type: number, blob: BlobCore): void {
		this.#pieces.set(
			type,
			new BlobCore(blob.buffer, blob.byteOffset, blob.littleEndian),
		);
	}

	/**
	 * Check if super blob contains type.
	 *
	 * @param type Index type.
	 * @returns Is contained.
	 */
	public contains(type: number): boolean {
		return this.#pieces.has(type);
	}

	/**
	 * Get blob by type.
	 *
	 * @param type Index type.
	 * @returns Blob or null if not found.
	 */
	public get(type: number): BlobCore | null {
		return this.#pieces.get(type) || null;
	}

	/**
	 * Size of super blob.
	 *
	 * @returns Byte length.
	 */
	public get size(): number {
		let size = SuperBlob.BYTE_LENGTH;
		for (const [, blob] of this.#pieces) {
			size += 8 + blob.length;
		}
		return size;
	}

	/**
	 * Create the super blob.
	 *
	 * @returns SuperBlob.
	 */
	public make(): SuperBlob {
		const pieces = this.#pieces;
		const count = pieces.size;
		const { size } = this;
		const buffer = new ArrayBuffer(size);
		const data = new Uint8Array(buffer);
		const view = dataView(buffer);
		const sb = new this.constructor.SuperBlob(buffer);
		sb.setup(size, count);
		let o1 = SuperBlob.BYTE_LENGTH;
		let o2 = o1 + count * 8;
		const types = [...pieces.keys()].sort((a, b) => a - b);
		for (const type of types) {
			view.setUint32(o1, type);
			o1 += 4;
			view.setUint32(o1, o2);
			o1 += 4;
			const { buffer, byteOffset, length } = pieces.get(type)!;
			data.set(new Uint8Array(buffer, byteOffset, length), o2);
			o2 += length;
		}
		return sb;
	}

	/**
	 * SuperBlob class.
	 */
	public static readonly SuperBlob = SuperBlob;
}
