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
 * Size iterator next.
 *
 * @template T Value type.
 */
export type SizeIteratorNext<T> = SizeIteratorYield<T> | SizeIteratorReturn;

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
	next(size?: number): SizeIteratorNext<T>;

	/**
	 * Close iterator.
	 *
	 * @param _ Unused.
	 */
	// deno-lint-ignore no-explicit-any
	return?(_?: any): any;
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
	next(size?: number): Promise<SizeIteratorNext<T>>;

	/**
	 * Close iterator.
	 *
	 * @param _ Unused.
	 */
	// deno-lint-ignore no-explicit-any
	return?(_?: any): Promise<any>;
}
