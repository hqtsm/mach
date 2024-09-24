import type {BufferView} from './type.ts';

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
