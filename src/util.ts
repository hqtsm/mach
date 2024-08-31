/**
 * Get integer in range, rounded down.
 *
 * @param name Integer name.
 * @param i Integer value.
 * @param l Lower limit.
 * @param h Higher limit.
 * @returns Integer value.
 */
export function integer(name: string, i: number, l: number, h: number) {
	if (i >= l && i <= h) {
		return i - (i % 1);
	}
	throw new RangeError(`Value ${i} of ${name} out of range ${l}-${h}`);
}

/**
 * Encode string to bytes.
 *
 * @param str String.
 * @returns Bytes.
 */
export function stringToBytes(str: string) {
	return new TextEncoder().encode(str);
}
