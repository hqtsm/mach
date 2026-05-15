import type { ArrayBufferPointer } from '@hqtsm/struct';
import { pointerBytes } from '../helpers/memory.ts';
import type { int } from './c.ts';
import type { size_t } from './stddef.ts';

/**
 * Compare bytes of two buffers.
 *
 * @param ptr1 Byte pointer.
 * @param ptr2 Byte pointer.
 * @param num Number of bytes to compare.
 * @returns Difference of first non-matching byte, 0 if equal.
 */
export function memcmp(
	ptr1: ArrayBufferLike | ArrayBufferPointer,
	ptr2: ArrayBufferLike | ArrayBufferPointer,
	num: size_t,
): int {
	const s1 = pointerBytes(ptr1);
	const s2 = pointerBytes(ptr2);
	for (let i = 0, c1, c2; num-- > 0; i++) {
		c1 = s1[i];
		c2 = s2[i];
		if (c1 !== c2) {
			return c1 - c2;
		}
	}
	return 0;
}

/**
 * Get length of string.
 *
 * @param str Character pointer, null terminated.
 * @returns Length of string.
 */
export function strlen(str: ArrayBufferLike | ArrayBufferPointer): size_t {
	const s = pointerBytes(str);
	let i = 0;
	for (; s[i]; i++);
	return i;
}

/**
 * Compare characters of two strings.
 *
 * @param str1 Character pointer.
 * @param str2 Character pointer.
 * @param n Maximum characters to compare.
 * @returns Difference of first non-matching character, 0 if equal.
 */
export function strncmp(
	str1: ArrayBufferLike | ArrayBufferPointer,
	str2: ArrayBufferLike | ArrayBufferPointer,
	n: size_t,
): int {
	const s1 = pointerBytes(str1);
	const s2 = pointerBytes(str2);
	for (let i = 0, c1, c2; n-- > 0; i++) {
		c1 = s1[i];
		c2 = s2[i];
		if (c1 !== c2) {
			return c1 - c2;
		}
		if (!c1) {
			return 0;
		}
	}
	return 0;
}
