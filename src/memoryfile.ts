import type {
	BufferView,
	FileLike,
	FileLikeRead,
	FileLikeStat,
	FileLikeWritten
} from './type.ts';
import {INT_LIMIT, BLK_LIMIT} from './const.ts';
import {ranged} from './util.ts';

/**
 * MemoryFile class.
 */
export class MemoryFile implements FileLike {
	public declare readonly ['constructor']: typeof MemoryFile;

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
		ranged(size, 0, INT_LIMIT);
		ranged(blksize, 1, BLK_LIMIT);
		this.#size = size;
		this.#blksize = blksize;
		for (const blocks = this.#blocks; size > 0; size -= blksize) {
			blocks.push(new Uint8Array(blksize));
		}
	}

	/**
	 * @inheritdoc
	 */
	public async stat(): Promise<FileLikeStat> {
		return {
			blocks: this.#blocks.length,
			blksize: this.#blksize,
			size: this.#size
		};
	}

	/**
	 * @inheritdoc
	 */
	public async truncate(size: number): Promise<void> {
		ranged(size, 0, INT_LIMIT);
		const s = this.#size;
		if (s === size) {
			return;
		}
		const blksize = this.#blksize;
		const blocks = this.#blocks;
		const o = size % blksize;
		const b = (size - o) / blksize;
		if (size > s) {
			for (let i = b + (o ? 1 : 0) - blocks.length; i--; ) {
				blocks.push(new Uint8Array(blksize));
			}
		} else if (o) {
			blocks.length = b + 1;
			blocks[b].fill(0, o);
		} else {
			blocks.length = b;
		}
		this.#size = size;
	}

	/**
	 * @inheritdoc
	 */
	public async read(
		buffer: BufferView,
		offset: number,
		length: number,
		position: number
	): Promise<FileLikeRead> {
		const {buffer: bd, byteOffset: bo, byteLength: bl} = buffer;
		ranged(offset, 0, bl);
		ranged(length, 0, bl - offset);
		ranged(position, 0, INT_LIMIT - bl);
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
	 * @inheritdoc
	 */
	public async write(
		buffer: Readonly<BufferView>,
		offset: number,
		length: number,
		position: number
	): Promise<FileLikeWritten> {
		const {buffer: bd, byteOffset: bo, byteLength: bl} = buffer;
		ranged(offset, 0, bl);
		ranged(length, 0, bl - offset);
		ranged(position, 0, INT_LIMIT - bl);
		if (length) {
			const blksize = this.#blksize;
			const blocks = this.#blocks;
			const size = this.#size;
			const bl = blocks.length;
			let p = position;
			let o = p % blksize;
			let b = (p - o) / blksize;
			for (let i = bo, l = length, s = blksize - o; ; b++) {
				if (l < s) {
					s = l;
				}
				const v = new Uint8Array(bd, i, s);
				if (b < bl) {
					blocks[b].set(v, o);
				} else {
					const a = new Uint8Array(blksize);
					a.set(v, o);
					blocks[b] = a;
				}
				p += s;
				if (p > size) {
					this.#size = p;
				}
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
			bytesWritten: length
		};
	}
}
