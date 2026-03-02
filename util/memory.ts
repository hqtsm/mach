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

/**
 * Get Uint8Array from a buffer or buffer view.
 *
 * @param value
 * @returns
 */
export function asUint8Array<T extends ArrayBufferLike>(
	value: T | ArrayBufferView<T>,
): Uint8Array<T> {
	return 'buffer' in value
		? new Uint8Array(value.buffer, value.byteOffset, value.byteLength)
		: new Uint8Array(value);
}

/**
 * Buffer as Uint8Array<ArrayBuffer>, copy if necessary.
 *
 * @param buffer Buffer.
 * @param offset Optional offset.
 * @param length Optional length.
 * @returns Uint8Array<ArrayBuffer>.
 */
export function asUint8ArrayArrayBuffer(
	buffer: ArrayBuffer | SharedArrayBuffer,
	offset?: number,
	length?: number,
): Uint8Array<ArrayBuffer> {
	return isSharedArrayBuffer(buffer)
		? new Uint8Array(buffer, offset, length).slice()
		: new Uint8Array(buffer, offset, length);
}
