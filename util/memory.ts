import type { ArrayBufferPointer } from '@hqtsm/struct';

// Spec says ArrayBuffer byteLength getter throws for SharedArrayBuffer.
const abbl = Object.getOwnPropertyDescriptor(
	ArrayBuffer.prototype,
	'byteLength',
)!.get!;

// Cache which prototypes are for ArrayBuffer.
const abp = new WeakMap<object, boolean>();

/**
 * ArrayBuffer data.
 */
export type ArrayBufferData = ArrayBuffer | ArrayBufferView<ArrayBuffer>;

/**
 * ArrayBufferLike data.
 */
export type ArrayBufferLikeData = ArrayBufferLike | ArrayBufferView;

/**
 * Is value an ArrayBuffer, not SharedArrayBuffer.
 *
 * @param value Value.
 * @returns True if value is a ArrayBuffer.
 */
export function isArrayBuffer(value: ArrayBufferLike): value is ArrayBuffer {
	const p = Object.getPrototypeOf(value);
	let r = abp.get(p);
	if (r === undefined) {
		try {
			abbl.call(value);
			r = true;
		} catch {
			r = false;
		}
		abp.set(p, r);
	}
	return r;
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
	return isArrayBuffer(buffer)
		? new Uint8Array(buffer, offset, length)
		: new Uint8Array(buffer, offset, length).slice();
}
