import { ENOMEM } from './errno.ts';

/**
 * Memory allocate.
 *
 * @param size Size in bytes.
 * @param context Context.
 * @returns Allocated memory.
 */
export function malloc(
	size: number,
	context?: { errno: number },
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
	size: number,
	context?: { errno: number },
): ArrayBuffer | null {
	return malloc(size, context);
}
