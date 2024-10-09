import type {BufferPointer, Cast, Sized} from './type.ts';

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
export function constant<T, U extends keyof T>(o: T, p: U, value: T[U] = o[p]) {
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

/**
 * Create new instance of a sized type with new memory.
 *
 * @param Type Constructor with BYTE_LENGTH property.
 * @returns New instance.
 */
export function cnew<T>(Type: Sized<T>) {
	return new Type(new ArrayBuffer(Type.BYTE_LENGTH));
}

/**
 * Create new instance from existing memory.
 *
 * @param Type Constructor function.
 * @param ptr Buffer pointer.
 * @returns New instance.
 */
export function cast<T>(Type: Cast<T>, ptr: Readonly<BufferPointer>) {
	return new Type(ptr.buffer, ptr.byteOffset);
}
