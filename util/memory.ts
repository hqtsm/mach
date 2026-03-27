import type { ArrayBufferPointer } from '@hqtsm/struct';

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
 * Is value a SharedArrayBuffer.
 *
 * @param value Value.
 * @returns True if value is a SharedArrayBuffer.
 */
export function isSharedArrayBuffer(
	value: ArrayBufferLike,
): value is SharedArrayBuffer {
	return toString.call(value) === '[object SharedArrayBuffer]';
}

/**
 * Pointer to Uint8Array.
 *
 * @template T Buffer type.
 * @param value Buffer or buffer pointer.
 * @param length Optional length.
 * @returns Uint8Array.
 */
export function pointerBytes<T extends ArrayBufferLike>(
	value: T | ArrayBufferPointer<T>,
	length?: number,
): Uint8Array<T> {
	return 'buffer' in value
		? new Uint8Array(value.buffer, value.byteOffset, length)
		: new Uint8Array(value, 0, length);
}

/**
 * View to Uint8Array.
 *
 * @template T Buffer type.
 * @param value Buffer or buffer view.
 * @returns Uint8Array.
 */
export function viewBytes<T extends ArrayBufferLike>(
	value: T | ArrayBufferView<T>,
): Uint8Array<T> {
	return 'buffer' in value
		? new Uint8Array(value.buffer, value.byteOffset, value.byteLength)
		: new Uint8Array(value);
}

/**
 * Buffer to Uint8Array<ArrayBuffer>, copy if necessary.
 *
 * @param buffer Buffer.
 * @param offset Optional offset.
 * @param length Optional length.
 * @returns Uint8Array<ArrayBuffer>.
 */
export function bufferBytes(
	buffer: ArrayBuffer | SharedArrayBuffer,
	offset?: number,
	length?: number,
): Uint8Array<ArrayBuffer> {
	return isSharedArrayBuffer(buffer)
		? new Uint8Array(buffer, offset, length).slice()
		: new Uint8Array(buffer, offset, length);
}
