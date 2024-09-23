import {SuperBlob} from './superblob.ts';

/**
 * SuperBlobMaker class.
 */
export class SuperBlobMaker {
	public declare readonly ['constructor']: typeof SuperBlobMaker;

	/**
	 * Blobs in super blob.
	 */
	readonly #pieces = new Map<
		number,
		this['constructor']['SuperBlob']['Blob']['prototype']
	>();

	/**
	 * Add blob to super blob.
	 *
	 * @param type Index type.
	 * @param blob Blob.
	 */
	public add(
		type: number,
		blob: this['constructor']['SuperBlob']['Blob']['prototype']
	) {
		this.#pieces.set(type, blob);
	}

	/**
	 * Check if super blob contains type.
	 *
	 * @param type Index type.
	 * @returns Is contained.
	 */
	public contains(type: number) {
		return this.#pieces.has(type);
	}

	/**
	 * Get blob by type.
	 *
	 * @param type Index type.
	 * @returns Blob or null if not found.
	 */
	public get(type: number) {
		return this.#pieces.get(type) || null;
	}

	/**
	 * Get the size of super blob.
	 *
	 * @returns Byte length.
	 */
	public size() {
		let size = 12;
		for (const [, blob] of this.#pieces) {
			size += 8 + blob.byteLength;
		}
		return size;
	}

	/**
	 * Create the super blob.
	 *
	 * @returns SuperBlob.
	 */
	public make() {
		const {SuperBlob} = this.constructor;
		const pieces = this.#pieces;
		const count = pieces.size;
		const size = this.size();
		const data = new DataView(new ArrayBuffer(size));
		const sb = new SuperBlob(data);
		sb.initialize(size);
		data.setUint32(8, count);
		let o1 = 12;
		let o2 = o1 + count * 8;
		for (const [type, blob] of pieces) {
			data.setUint32(o1, type);
			o1 += 4;
			data.setUint32(o1, o2);
			o1 += 4;
			o2 += blob.byteWrite(data, o2);
		}
		return sb;
	}

	/**
	 * SuperBlob reference.
	 */
	public static readonly SuperBlob = SuperBlob;
}