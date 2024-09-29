import type {BufferPointer, BufferView, Cast, Newt} from './type.ts';

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

/**
 * Get subview from BufferView.
 *
 * @param Type View constructor.
 * @param view BufferView.
 * @param offset Offset into view.
 * @param length Length of view.
 * @returns View over BufferView buffer.
 */
export function subview<T>(
	Type: new (
		buffer: ArrayBuffer,
		byteOffset: number,
		byteLength: number
	) => T,
	view: BufferView,
	offset = 0,
	length = -1
) {
	const {buffer, byteOffset, byteLength} = view;
	ranged(offset, 0, byteLength);
	const limit = byteLength - offset;
	if (length < 0) {
		length = limit;
	} else {
		ranged(length, 0, limit);
	}
	return new Type(buffer, byteOffset + offset, length);
}
