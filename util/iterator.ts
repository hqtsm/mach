/**
 * Size iterator yield.
 *
 * @template T Value type.
 */
export interface SizeIteratorYield<T> {
	/**
	 * Not done.
	 */
	done?: false;

	/**
	 * Value.
	 */
	value: T;
}

/**
 * Size iterator return.
 */
export interface SizeIteratorReturn {
	/**
	 * Done.
	 */
	done: true;
}

/**
 * Size iterator.
 */
export interface SizeIterator<T> {
	/**
	 * Get the next value.
	 *
	 * @param size Requested size.
	 * @returns Next value.
	 */
	next(size?: number): SizeIteratorYield<T> | SizeIteratorReturn;

	/**
	 * Close iterator.
	 */
	// deno-lint-ignore no-explicit-any
	return?(value?: any): any;
}

/**
 * Size async iterator.
 */
export interface SizeAsyncIterator<T> {
	/**
	 * Get the next value.
	 *
	 * @param size Requested size.
	 * @returns Next value.
	 */
	next(size?: number): Promise<SizeIteratorYield<T> | SizeIteratorReturn>;

	/**
	 * Close iterator.
	 */
	// deno-lint-ignore no-explicit-any
	return?(value?: any): Promise<any>;
}
