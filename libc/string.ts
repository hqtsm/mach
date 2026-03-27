import type { ArrayBufferPointer } from '@hqtsm/struct';
import { pointerBytes } from '../util/memory.ts';
import type { int } from './c.ts';
import type { size_t } from './stddef.ts';

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
