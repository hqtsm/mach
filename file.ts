// Highest number value before approximation, 2^53-1.
export const INT_LIMIT = 0x1fffffffffffff;

const BS = 4096;

export function ranged(i: number, l: number, h: number): void {
	if (!(i >= l && i <= h)) {
		throw new RangeError(`Value ${i} out of range ${l}-${h}`);
	}
}

/**
 * File stat.
 */
export interface FileStats {
	/**
	 * Number of blocks.
	 */
	blocks: number;

	/**
	 * Block size.
	 */
	blksize: number;

	/**
	 * File size.
	 */
	size: number;
}

/**
 * File read stats.
 */
export interface FileReadStats {
	/**
	 * Number of bytes read.
	 */
	bytesRead: number;
}

/**
 * File write stats.
 */
export interface FileWriteStats {
	/**
	 * Number of bytes written.
	 */
	bytesWritten: number;
}

/**
 * File statable.
 */
export interface FileStatable {
	/**
	 * Stat file.
	 */
	stat(): FileStats | Promise<FileStats>;
}

/**
 * File truncatable.
 */
export interface FileTruncatable {
	/**
	 * Truncate file to size.
	 *
	 * @param size New size.
	 */
	truncate(size: number): void | Promise<void>;
}

/**
 * File readable.
 */
export interface FileReadable {
	/**
	 * Read from file.
	 *
	 * @param buffer Buffer view.
	 * @param offset Byte offset into buffer.
	 * @param length Number of bytes to read.
	 * @param position Byte offset into file.
	 * @returns Object with the number of bytes read.
	 */
	read(
		buffer: ArrayBufferView,
		offset: number,
		length: number,
		position: number,
	): FileReadStats | Promise<FileReadStats>;
}

/**
 * File writable.
 */
export interface FileWritable {
	/**
	 * Write to file.
	 *
	 * @param buffer Buffer view.
	 * @param offset Byte offset into buffer.
	 * @param length Number of bytes to write.
	 * @param position Byte offset into file.
	 * @returns Object with the number of bytes written.
	 */
	write(
		buffer: Readonly<ArrayBufferView>,
		offset: number,
		length: number,
		position: number,
	): FileWriteStats | Promise<FileWriteStats>;
}

/**
 * File interface.
 */
export interface File
	extends FileStatable, FileReadable, FileWritable, FileTruncatable {
}

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
	 * Data size.
	 */
	#size = 0;

	/**
	 * Create in-memory file-like object.
	 */
	constructor() {}

	public stat(): FileStats {
		return {
			blocks: this.#blocks.length,
			blksize: BS,
			size: this.#size,
		};
	}

	public truncate(size: number): void {
		ranged(size, 0, INT_LIMIT);
		const s = this.#size;
		if (s === size) {
			return;
		}
		const blocks = this.#blocks;
		const o = size % BS;
		const b = (size - o) / BS;
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

	public read(
		buffer: ArrayBufferView,
		offset: number,
		length: number,
		position: number,
	): FileReadStats {
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
			const blocks = this.#blocks;
			let o = position % BS;
			let b = (position - o) / BS;
			for (let i = 0, l = length, s = BS - o;; b++) {
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
				s = BS;
			}
		}
		return {
			bytesRead: length,
		};
	}

	public write(
		buffer: Readonly<ArrayBufferView>,
		offset: number,
		length: number,
		position: number,
	): FileWriteStats {
		const { buffer: bd, byteOffset: bo, byteLength: bl } = buffer;
		ranged(offset, 0, bl);
		ranged(length, 0, bl - offset);
		ranged(position, 0, INT_LIMIT - bl);
		if (length) {
			const blocks = this.#blocks;
			const size = this.#size;
			let p = position;
			let o = p % BS;
			let b = (p - o) / BS;
			for (let i = bo, l = length, s = BS - o;; b++) {
				if (l < s) {
					s = l;
				}
				const w = new Uint8Array(bd, i, s);
				let d = blocks[b];
				if (!d) {
					blocks[b] = d = new Uint8Array(BS);
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
				s = BS;
			}
		}
		return {
			bytesWritten: length,
		};
	}
}
