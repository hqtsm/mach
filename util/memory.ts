const { toString } = Object.prototype;

/**
 * ArrayBuffer data.
 */
export type ArrayBufferData = ArrayBuffer | ArrayBufferView<ArrayBuffer>;

/**
 * ArrayBufferLike data.
 */
export type ArrayBufferLikeData = ArrayBufferLike | ArrayBufferView;

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
	return toString.call(value) === '[object SharedArrayBuffer]';
}

/**
 * Get Uint8Array from a buffer or buffer view.
 *
 * @param value Buffer or buffer view.
 * @param length Optional length.
 * @returns Uint8Array.
 */
export function asUint8Array<T extends ArrayBufferLike>(
	value: T | ArrayBufferView<T>,
	length?: number,
): Uint8Array<T> {
	return 'buffer' in value
		? new Uint8Array(
			value.buffer,
			value.byteOffset,
			length ?? value.byteLength,
		)
		: new Uint8Array(value, 0, length);
}

/**
 * Buffer to Uint8Array<ArrayBuffer>, copy if necessary.
 *
 * @param buffer Buffer.
 * @param offset Optional offset.
 * @param length Optional length.
 * @returns Uint8Array<ArrayBuffer>.
 */
export function toUint8ArrayArrayBuffer(
	buffer: ArrayBuffer | SharedArrayBuffer,
	offset?: number,
	length?: number,
): Uint8Array<ArrayBuffer> {
	return isSharedArrayBuffer(buffer)
		? new Uint8Array(buffer, offset, length).slice()
		: new Uint8Array(buffer, offset, length);
}
