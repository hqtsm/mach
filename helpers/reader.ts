/**
 * Data reader, a subset of Blob.
 */
export interface Reader {
	/**
	 * Size of data.
	 */
	readonly size: number;

	/**
	 * Type of data.
	 */
	readonly type: string;

	/**
	 * Read data from source.
	 *
	 * @returns ArrayBuffer copy.
	 */
	arrayBuffer(): Promise<ArrayBuffer>;

	/**
	 * Get a slice of data.
	 *
	 * @param start Start index.
	 * @param end End index.
	 * @param contentType Content type.
	 * @returns Reader.
	 */
	slice(start?: number, end?: number, contentType?: string): Reader;
}
