/**
 * Data view write methods.
 */
export type DataViewWriteMethods =
	| 'setInt8'
	| 'setUint8'
	| 'setInt16'
	| 'setUint16'
	| 'setInt32'
	| 'setUint32'
	| 'setFloat32'
	| 'setFloat64'
	| 'setBigInt64'
	| 'setBigUint64';

/**
 * Readonly DataView.
 */
export type ReadonlyDataView = Readonly<Omit<DataView, DataViewWriteMethods>>;

/**
 * Typed array write methods.
 */
export type TypedArrayWriteMethods =
	| 'copyWithin'
	| 'fill'
	| 'reverse'
	| 'set'
	| 'sort'
	| 'subarray';

/**
 * Readonly Uint8Array.
 */
export type ReadonlyUint8Array = Readonly<
	Omit<Uint8Array, TypedArrayWriteMethods>
>;

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
