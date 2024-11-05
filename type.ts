/**
 * If A equals B then C else D.
 */
export type IfTypesEqual<A, B, C, D> = (<T>() => T extends A ? 1 : 2) extends
	<T>() => T extends B ? 1 : 2 ? C : D;

/**
 * Readonly keys for a given type.
 */
export type ReadonlyKeyof<T> = NonNullable<
	{
		[K in keyof T]: IfTypesEqual<
			{ [L in K]: T[K] },
			{ readonly [L in K]: T[K] },
			K,
			never
		>;
	}[keyof T]
>;

/**
 * Keys for a given value type.
 */
export type KeyofType<T, U> = {
	[K in keyof T]: T[K] extends U ? K : never;
}[keyof T];

/**
 * Readonly keys for a given value type.
 */
export type ReadonlyKeyofType<T, U> = {
	[K in ReadonlyKeyof<T>]: T[K] extends U ? K : never;
}[ReadonlyKeyof<T>];

/**
 * Array buffer type, excluding similar incompatible types like typed arrays.
 */
export type ArrayBufferReal = ArrayBufferLike & { BYTES_PER_ELEMENT?: never };

/**
 * Buffer view.
 */
export interface BufferView {
	/**
	 * Array buffer.
	 */
	readonly buffer: ArrayBufferReal;

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
 * Cast type sized constructor.
 */
export interface Cast<T> {
	/**
	 * Cast new instance from existing memory.
	 */
	new (buffer: ArrayBufferReal, byteOffset?: number): T;
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
		position: number,
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
		position: number,
	): Promise<FileLikeWritten>;
}
