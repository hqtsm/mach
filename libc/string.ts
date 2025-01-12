import type { ArrayBufferReal, BufferPointer } from '@hqtsm/struct';

/**
 * Get length of string.
 *
 * @param str Character pointer, null terminated.
 * @returns Length of string.
 */
export function strlen(str: ArrayBufferReal | BufferPointer): number {
	let b, o;
	if ('buffer' in str) {
		b = str.buffer;
		o = str.byteOffset;
	} else {
		b = str;
		o = 0;
	}
	let r = 0;
	for (const c = new Uint8Array(b); c[o++]; r++);
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
	str1: ArrayBufferReal | BufferPointer,
	str2: ArrayBufferReal | BufferPointer,
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
	const c1 = new Uint8Array(b1);
	const c2 = new Uint8Array(b2);
	for (let i = 0, u1, u2; i < num; i++) {
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
