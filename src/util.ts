/**
 * Encode string to bytes.
 *
 * @param str String.
 * @returns Bytes.
 */
export function stringToBytes(str: string) {
	return new TextEncoder().encode(str);
}
