import {
	BufferView,
	FileLike,
	FileLikeRead,
	FileLikeStat,
	FileLikeWritten
} from './type.ts';
import {INT_LIMIT, BLK_LIMIT} from './const.ts';
import {integer} from './util.ts';

/**
 * MemoryFile class.
 */
export class MemoryFile implements FileLike {
	/**
	 * Data blocks.
	 */
	readonly #blocks: Uint8Array[] = [];

	/**
	 * Block size.
	 */
	readonly #blksize: number;

	/**
	 * Data size.
	 */
	#size: number;

	/**
	 * MemoryFile constructor.
	 *
	 * @param size File size.
	 * @param blksize Block size.
	 */
	constructor(size = 0, blksize = 4096) {
		size = integer('size', size, 0, INT_LIMIT);
		blksize = integer('blksize', blksize, 1, BLK_LIMIT);
		this.#size = size;
		this.#blksize = blksize;
		for (const blocks = this.#blocks; size > 0; size -= blksize) {
			blocks.push(new Uint8Array(blksize));
		}
	}

	/**
	 * Stat file.
	 *
	 * @returns Stat result.
	 */
	public async stat(): Promise<FileLikeStat> {
		return {
			blocks: this.#blocks.length,
			blksize: this.#blksize,
			size: this.#size
		};
	}

	/**
	 * Truncate file to size.
	 *
	 * @param size New size.
	 */
	public async truncate(size: number): Promise<void> {
		size = integer('size', size, 0, INT_LIMIT);
		const blksize = this.#blksize;
		const blocks = this.#blocks;
		const s = this.#size;
		if (size < s) {
			const o = size % blksize;
			const b = (size - o) / blksize;
			if (o) {
				blocks.length = b + 1;
				blocks[b].fill(0, o);
			} else {
				blocks.length = b;
			}
		} else if (size > s) {
			for (let i = size / blksize - blocks.length; i-- > 0; ) {
				blocks.push(new Uint8Array(blksize));
			}
		}
		this.#size = size;
	}

	/**
	 * Read from file.
	 *
	 * @param buffer Buffer view.
	 * @param offset Byte offset into buffer.
	 * @param length Number of bytes to read.
	 * @param position Byte offset into file.
	 * @returns Object with the number of bytes read.
	 */
	public async read(
		buffer: BufferView,
		offset: number,
		length: number,
		position: number
	): Promise<FileLikeRead> {
		const {buffer: bd, byteOffset: bo, byteLength: bl} = buffer;
		offset = integer('offset', offset, 0, bl);
		length = integer('length', length, 0, bl - offset);
		position = integer('position', position, 0, INT_LIMIT - bl);
		const size = this.#size;
		if (position + length > size) {
			length = size - position;
		}
		if (length) {
			const d = new Uint8Array(bd, bo + offset, length);
			const blksize = this.#blksize;
			const blocks = this.#blocks;
			let o = position % blksize;
			let b = (position - o) / blksize;
			for (let i = 0, l = length, s = blksize - o; ; b++) {
				if (l < s) {
					s = l;
				}
				d.set(blocks[b].subarray(o, o + s), i);
				l -= s;
				if (l <= 0) {
					break;
				}
				i += s;
				o = 0;
				s = blksize;
			}
		}
		return {
			bytesRead: length
		};
	}

	/**
	 * Write to file.
	 *
	 * @param buffer Buffer view.
	 * @param offset Byte offset into buffer.
	 * @param length Number of bytes to write.
	 * @param position Byte offset into file.
	 * @returns Object with the number of bytes written.
	 */
	public async write(
		buffer: Readonly<BufferView>,
		offset: number,
		length: number,
		position: number
	): Promise<FileLikeWritten> {
		const {buffer: bd, byteOffset: bo, byteLength: bl} = buffer;
		offset = integer('offset', offset, 0, bl);
		length = integer('length', length, 0, bl - offset);
		position = integer('position', position, 0, INT_LIMIT - bl);
		if (length) {
			const blksize = this.#blksize;
			const blocks = this.#blocks;
			const end = position + length;
			for (let i = end / blksize - blocks.length; i-- > 0; ) {
				blocks.push(new Uint8Array(blksize));
			}
			let o = position % blksize;
			let b = (position - o) / blksize;
			for (let i = bo, l = length, s = blksize - o; ; b++) {
				if (l < s) {
					s = l;
				}
				blocks[b].set(new Uint8Array(bd, i, s), o);
				l -= s;
				if (l <= 0) {
					break;
				}
				i += s;
				o = 0;
				s = blksize;
			}
			if (end > this.#size) {
				this.#size = end;
			}
		}
		return {
			bytesWritten: length
		};
	}
}
