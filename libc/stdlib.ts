/**
 * Memory allocate.
 *
 * @param size Size in bytes.
 * @returns Allocated memory.
 */
export function malloc(size: number): ArrayBuffer | null {
	try {
		return new ArrayBuffer(size);
	} catch (err) {
		if (err instanceof RangeError) {
			return null;
		}
		throw err;
	}
}

/**
 * Clear memory allocate.
 *
 * @param size Size in bytes.
 * @returns Allocated memory.
 */
export function calloc(size: number): ArrayBuffer | null {
	return malloc(size);
}
