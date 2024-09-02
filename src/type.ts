export interface BufferView {
	buffer: ArrayBuffer;
	byteLength: number;
	byteOffset: number;
}

export interface Length {
	/**
	 * Byte length.
	 */
	get length(): number;
}

export interface Write {
	/**
	 * Write to buffer view.
	 *
	 * @param buffer Buffer view.
	 * @param offset Byte offset into buffer.
	 * @returns Write length.
	 */
	write(buffer: BufferView, offset?: number): number;
}

export interface FileLikeStat {
	blocks: number;
	blksize: number;
	size: number;
}

export interface FileLikeRead {
	bytesRead: number;
}

export interface FileLikeWritten {
	bytesWritten: number;
}

export interface FileLike {
	stat(): Promise<FileLikeStat>;

	truncate(size: number): Promise<void>;

	read(
		buffer: Readonly<BufferView>,
		offset: number,
		length: number,
		position: number
	): Promise<FileLikeRead>;

	write(
		buffer: BufferView,
		offset: number,
		length: number,
		position: number
	): Promise<FileLikeWritten>;
}
