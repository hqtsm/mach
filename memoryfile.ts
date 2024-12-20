import type {
	BufferView,
	File,
	FileReadStats,
	FileStats,
	FileWriteStats,
} from './type.ts';
import { BLK_LIMIT, INT_LIMIT } from './const.ts';
import { ranged } from './util.ts';

/**
 * In-memory file-like object.
 */
export class MemoryFile implements File {
	declare public readonly ['constructor']: Omit<typeof MemoryFile, 'new'>;

	/**
	 * Data blocks.
	 */
	readonly #blocks: (Uint8Array | undefined)[] = [];

	/**
	 * Block size.
	 */
	readonly #blksize: number;

	/**
	 * Data size.
	 */
	#size: number;

	/**
	 * Create file with optional initial size and custom block size.
	 *
	 * @param size File size.
	 * @param blksize Block size.
	 */
	constructor(size = 0, blksize = 4096) {
		ranged(size, 0, INT_LIMIT);
		ranged(blksize, 1, BLK_LIMIT);
		this.#size = size;
		this.#blksize = blksize;
		const o = size % blksize;
		this.#blocks.length = (size - o) / blksize + (o ? 1 : 0);
	}

	// deno-lint-ignore require-await
	public async stat(): Promise<FileStats> {
		return {
			blocks: this.#blocks.length,
			blksize: this.#blksize,
			size: this.#size,
		};
	}

	// deno-lint-ignore require-await
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
			blocks.length = b + (o ? 1 : 0);
		} else if (o) {
			blocks.length = b + 1;
			blocks[b]?.fill(0, o);
		} else {
			blocks.length = b;
		}
		this.#size = size;
	}

	// deno-lint-ignore require-await
	public async read(
		buffer: BufferView,
		offset: number,
		length: number,
		position: number,
	): Promise<FileReadStats> {
		const { buffer: bd, byteOffset: bo, byteLength: bl } = buffer;
		ranged(offset, 0, bl);
		ranged(length, 0, bl - offset);
		ranged(position, 0, INT_LIMIT - bl);
		const size = this.#size;
		if (position + length > size) {
			length = size - position;
		}
		if (length) {
			const r = new Uint8Array(bd, bo + offset, length);
			const blksize = this.#blksize;
			const blocks = this.#blocks;
			let o = position % blksize;
			let b = (position - o) / blksize;
			for (let i = 0, l = length, s = blksize - o;; b++) {
				if (l < s) {
					s = l;
				}
				const d = blocks[b];
				if (d) {
					r.set(d.subarray(o, o + s), i);
				} else {
					r.fill(0, i, i + s);
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
			bytesRead: length,
		};
	}

	// deno-lint-ignore require-await
	public async write(
		buffer: Readonly<BufferView>,
		offset: number,
		length: number,
		position: number,
	): Promise<FileWriteStats> {
		const { buffer: bd, byteOffset: bo, byteLength: bl } = buffer;
		ranged(offset, 0, bl);
		ranged(length, 0, bl - offset);
		ranged(position, 0, INT_LIMIT - bl);
		if (length) {
			const blksize = this.#blksize;
			const blocks = this.#blocks;
			const size = this.#size;
			let p = position;
			let o = p % blksize;
			let b = (p - o) / blksize;
			for (let i = bo, l = length, s = blksize - o;; b++) {
				if (l < s) {
					s = l;
				}
				const w = new Uint8Array(bd, i, s);
				let d = blocks[b];
				if (!d) {
					blocks[b] = d = new Uint8Array(blksize);
				}
				d.set(w, o);
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
			bytesWritten: length,
		};
	}
}
