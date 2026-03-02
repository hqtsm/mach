/**
 * Align a number up.
 *
 * @param value Number.
 * @param alignment Alignment.
 * @returns Aligned number.
 */
export function alignUp(value: number, alignment: number): number {
	const over = value % alignment;
	return over ? value + alignment - over : value;
}

/**
 * Is value a SharedArrayBuffer.
 *
 * @param value Value.
 * @returns True if value is a SharedArrayBuffer.
 */
export function isSharedArrayBuffer(
	value: unknown,
): value is SharedArrayBuffer {
	return Object.prototype.toString.call(value) ===
		'[object SharedArrayBuffer]';
}
