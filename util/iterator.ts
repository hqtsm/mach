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
 *
 * @template T Value type.
 * @template S Size type.
 */
export interface SizeIterator<T, S = number> {
	/**
	 * Get the next value.
	 *
	 * @param size Requested size.
	 * @returns Next value.
	 */
	next(size?: S): SizeIteratorNext<T>;

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
 *
 * @template T Value type.
 * @template S Size type.
 */
export interface SizeAsyncIterator<T, S = number> {
	/**
	 * Get the next value.
	 *
	 * @param size Requested size.
	 * @returns Next value.
	 */
	next(size?: S): Promise<SizeIteratorNext<T>>;

	/**
	 * Close iterator.
	 *
	 * @param _ Unused.
	 */
	// deno-lint-ignore no-explicit-any
	return?(_?: any): Promise<any>;
}
