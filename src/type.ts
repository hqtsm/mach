/**
 * Buffer view.
 */
export interface BufferView {
	/**
	 * Array buffer.
	 */
	readonly buffer: ArrayBuffer;

	/**
	 * Byte length.
	 */
	readonly byteLength: number;

	/**
	 * Byte offset.
	 */
	readonly byteOffset: number;
}

/**
 * Buffer pointer.
 */
export interface BufferPointer {
	/**
	 * Array buffer.
	 */
	readonly buffer: ArrayBuffer;

	/**
	 * Byte offset.
	 */
	readonly byteOffset: number;
}

/**
 * New type sized constructor.
 */
export interface Newt<T> {
	new (buffer: ArrayBuffer): T;

	readonly sizeof: number;
}

/**
 * Cast type sized constructor.
 */
export interface Cast<T> {
	/**
	 * Cast new instance from existing memory.
	 */
	new (buffer: ArrayBuffer, byteOffset?: number): T;
}

/**
 * File stat.
 */
export interface FileLikeStat {
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
 * File read status.
 */
export interface FileLikeRead {
	/**
	 * Number of bytes read.
	 */
	bytesRead: number;
}

/**
 * File written status.
 */
export interface FileLikeWritten {
	/**
	 * Number of bytes written.
	 */
	bytesWritten: number;
}

/**
 * File interface.
 */
export interface FileLike {
	/**
	 * Stat file.
	 *
	 * @returns Stat result.
	 */
	stat(): Promise<FileLikeStat>;

	/**
	 * Truncate file to size.
	 *
	 * @param size New size.
	 */
	truncate(size: number): Promise<void>;

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
		buffer: Readonly<BufferView>,
		offset: number,
		length: number,
		position: number
	): Promise<FileLikeRead>;

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
		buffer: BufferView,
		offset: number,
		length: number,
		position: number
	): Promise<FileLikeWritten>;
}
