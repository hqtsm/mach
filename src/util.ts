import type {BufferPointer, Cast, Newt} from './type.ts';

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
 * Create new instance of a sized type with clean memory.
 *
 * @param Constructor Constructor with sizeof property.
 * @returns New instance.
 */
export function newt<T>(Constructor: Newt<T>) {
	return new Constructor(new ArrayBuffer(Constructor.sizeof));
}

/**
 * Create new instance from existing memory.
 *
 * @param Constructor Constructor function.
 * @param ptr Buffer pointer.
 * @returns New instance.
 */
export function cast<T>(Constructor: Cast<T>, ptr: BufferPointer) {
	return new Constructor(ptr.buffer, ptr.byteOffset);
}
