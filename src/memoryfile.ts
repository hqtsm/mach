import {
	BufferView,
	FileLike,
	FileLikeRead,
	FileLikeStat,
	FileLikeWritten
} from './types';

// Highest number value before approximation, 2^53-1.
const INT_LIMIT = 0x1fffffffffffff;

// A very large but still compatible upper block size limit.
const BLK_LIMIT = 0x100000000;

/**
 * Assert integer in range, rounded down.
 *
 * @param name Integer name.
 * @param i Integer value.
 * @param l Lower limit.
 * @param h Higher limit.
 * @returns Integer value.
 */
function range(name: string, i: number, l: number, h: number) {
	if (i >= l && i <= h) {
		return i - (i % 1);
	}
	throw new RangeError(`Value ${i} of ${name} out of range ${l}-${h}`);
}

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
		size = range('size', size, 0, INT_LIMIT);
		blksize = range('blksize', blksize, 1, BLK_LIMIT);
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
	// eslint-disable-next-line @typescript-eslint/require-await
	public async stat(): Promise<FileLikeStat> {
		return {
			blocks: this.#blocks.length,
			blksize: this.#blksize,
			size: this.#size
		};
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
	// eslint-disable-next-line @typescript-eslint/require-await
	public async read(
		buffer: BufferView,
		offset: number,
		length: number,
		position: number
	): Promise<FileLikeRead> {
		const {buffer: bd, byteOffset: bo, byteLength: bl} = buffer;
		offset = range('offset', offset, 0, bl);
		length = range('length', length, 0, bl - offset);
		position = range('position', position, 0, INT_LIMIT - bl);
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
	// eslint-disable-next-line @typescript-eslint/require-await
	public async write(
		buffer: Readonly<BufferView>,
		offset: number,
		length: number,
		position: number
	): Promise<FileLikeWritten> {
		const {buffer: bd, byteOffset: bo, byteLength: bl} = buffer;
		offset = range('offset', offset, 0, bl);
		length = range('length', length, 0, bl - offset);
		position = range('position', position, 0, INT_LIMIT - bl);
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
