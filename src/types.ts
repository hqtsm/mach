export interface BufferView {
	buffer: ArrayBuffer;
	byteLength: number;
	byteOffset: number;
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
