export interface BufferView {
	buffer: ArrayBuffer;
	byteLength: number;
	byteOffset: number;
}

export interface FileLike {
	stat(): Promise<{size: number}>;

	read(
		buffer: Readonly<BufferView>,
		offset: number,
		length: number,
		position: number
	): Promise<{
		bytesRead: number;
	}>;

	write(
		buffer: BufferView,
		offset: number,
		length: number,
		position: number
	): Promise<{
		bytesWritten: number;
	}>;
}
