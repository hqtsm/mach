import type { ArrayBufferPointer } from '@hqtsm/struct';
import { pointerBytes } from '../util/mod.ts';
import type { int } from './c.ts';
import { ENOMEM } from './errno.ts';
import type { size_t } from './stddef.ts';

/**
 * Memory allocate.
 *
 * @param size Size in bytes.
 * @param context Context.
 * @returns Allocated memory.
 */
export function malloc(
	size: size_t,
	context?: { errno: int },
): ArrayBuffer | null {
	try {
		return new ArrayBuffer(size);
	} catch (err) {
		if (err instanceof RangeError) {
			if (context) context.errno = ENOMEM;
			return null;
		}
		throw err;
	}
}

/**
 * Clear memory allocate.
 *
 * @param count Number of elements.
 * @param size Size of each element in bytes.
 * @param context Context.
 * @returns Allocated memory.
 */
export function calloc(
	count: size_t,
	size: size_t,
	context?: { errno: int },
): ArrayBuffer | null {
	return malloc(count * size, context);
}

/**
 * Reallocate memory.
 *
 * @param buffer Existing memory.
 * @param size Size in bytes.
 * @param context Context.
 * @returns Reallocated memory.
 */
export function realloc(
	buffer: ArrayBuffer | null,
	size: size_t,
	context?: { errno: int },
): ArrayBuffer | null {
	if (!buffer) {
		return malloc(size, context);
	}
	const l = buffer.byteLength;
	if (l === size) {
		return buffer;
	}
	const m = malloc(size, context);
	if (m && l) {
		new Uint8Array(m).set(new Uint8Array(buffer, 0, size < l ? size : l));
	}
	return m;
}

/**
 * Memory set.
 *
 * @param buffer Memory pointer.
 * @param value Fill value.
 * @param size Size in bytes.
 */
export function memset(
	buffer: ArrayBufferLike | ArrayBufferPointer,
	value: int,
	size: size_t,
): void {
	pointerBytes(buffer, size).fill(value);
}
