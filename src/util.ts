import {BufferView} from './type';

/**
 * Get integer in range, rounded down.
 *
 * @param i Integer value.
 * @param l Lower limit.
 * @param h Higher limit.
 * @returns Integer value.
 */
export function integer(i: number, l: number, h: number) {
	if (i >= l && i <= h) {
		return i - (i % 1);
	}
	throw new RangeError(`Value ${i} out of range ${l}-${h}`);
}

let textEncoder: InstanceType<typeof TextEncoder> | undefined;

/**
 * Encode string to bytes.
 *
 * @param str String.
 * @returns Bytes.
 */
export function stringToBytes(str: string) {
	textEncoder ??= new TextEncoder();
	return textEncoder.encode(str);
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
	offset = integer(offset, 0, byteLength);
	const limit = byteLength - offset;
	length = length >= 0 ? integer(length, 0, limit) : limit;
	return new Type(buffer, byteOffset + offset, length);
}

/**
 * Assign value to sparse array with automatic garbage collecting.
 *
 * @param array Parse array.
 * @param index Value index.
 * @param value Value assigned to index, or undefined to delete.
 */
export function sparseSet(array: unknown[], index: number, value: unknown) {
	// eslint-disable-next-line no-undefined
	if (value === undefined) {
		let last = array.length - 1;
		if (index < last) {
			delete array[index];
		} else if (index === last) {
			do {
				last--;
				// eslint-disable-next-line no-undefined
			} while (last >= 0 && array[last] === undefined);
			array.length = last + 1;
		}
	} else {
		array[index] = value;
	}
}
