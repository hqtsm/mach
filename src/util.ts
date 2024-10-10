import type {BufferPointer, Cast, ReadonlyKeyof, Sized} from './type.ts';

/**
 * Align a number up.
 *
 * @param value Number.
 * @param alignment Alignment.
 * @returns Aligned number.
 */
export function alignUp(value: number, alignment: number) {
	const over = value % alignment;
	return over ? value + alignment - over : value;
}

/**
 * Define constant.
 *
 * @param o Object to define constant property on.
 * @param p Property name.
 * @param value Optional value, defaults to current value.
 */
export function constant<T, U extends ReadonlyKeyof<T>>(
	o: T,
	p: U,
	value: T[U] = o[p]
) {
	Object.defineProperty(o, p, {value});
}

/**
 * Assert integer in range.
 *
 * @param i Integer value.
 * @param l Lower limit.
 * @param h Higher limit.
 */
export function ranged(i: number, l: number, h: number) {
	if (!(i >= l && i <= h)) {
		throw new RangeError(`Value ${i} out of range ${l}-${h}`);
	}
}
