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
 * @param size Size in bytes.
 * @param context Context.
 * @returns Allocated memory.
 */
export function calloc(
	size: size_t,
	context?: { errno: int },
): ArrayBuffer | null {
	return malloc(size, context);
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
	buffer: ArrayBuffer,
	size: size_t,
	context?: { errno: int },
): ArrayBuffer | null {
	const m = malloc(size, context);
	if (m) {
		const l = buffer.byteLength;
		new Uint8Array(m).set(new Uint8Array(buffer, 0, size > l ? l : size));
	}
	return m;
}
