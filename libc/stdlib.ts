import type { ArrayBufferPointer } from '@hqtsm/struct';
import { asUint8Array } from '../util/memory.ts';
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
	buffer: ArrayBuffer | ArrayBufferPointer | null,
	size: size_t,
	context?: { errno: int },
): ArrayBuffer | null {
	const m = malloc(size, context);
	if (m && buffer) {
		new Uint8Array(m).set(asUint8Array(buffer).slice(0, size));
	}
	return m;
}
