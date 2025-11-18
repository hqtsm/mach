import type { ArrayBufferPointer } from '@hqtsm/struct';

/**
 * Get length of string.
 *
 * @param str Character pointer, null terminated.
 * @returns Length of string.
 */
export function strlen(str: ArrayBufferLike | ArrayBufferPointer): number {
	let b, o, c, r = 0;
	if ('buffer' in str) {
		b = str.buffer;
		o = str.byteOffset;
	} else {
		b = str;
		o = 0;
	}
	for (c = new Uint8Array(b); c[o++]; r++);
	return r;
}

/**
 * Compare characters of two strings.
 *
 * @param str1 Character pointer.
 * @param str2 Character pointer.
 * @param num Maximum characters to compare.
 * @returns Difference of first non-matching character, 0 if equal.
 */
export function strncmp(
	str1: ArrayBufferLike | ArrayBufferPointer,
	str2: ArrayBufferLike | ArrayBufferPointer,
	num: number,
): number {
	let b1, o1, b2, o2;
	if ('buffer' in str1) {
		b1 = str1.buffer;
		o1 = str1.byteOffset;
	} else {
		b1 = str1;
		o1 = 0;
	}
	if ('buffer' in str2) {
		b2 = str2.buffer;
		o2 = str2.byteOffset;
	} else {
		b2 = str2;
		o2 = 0;
	}
	for (
		let c1 = new Uint8Array(b1), c2 = new Uint8Array(b2), u1, u2;
		num-- > 0;
	) {
		u1 = c1[o1++];
		u2 = c2[o2++];
		if (u1 !== u2) {
			return u1 - u2;
		}
		if (!u1) {
			return 0;
		}
	}
	return 0;
}
