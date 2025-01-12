import type { ArrayBufferReal, BufferPointer } from '@hqtsm/struct';

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

export function strncmp(
	str1: ArrayBufferReal | BufferPointer,
	str2: ArrayBufferReal | BufferPointer,
	num: number,
): -1 | 0 | 1 {
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
	for (let i = 0; i < num; i++) {
		const a = c1[o1++];
		const b = c2[o2++];
		const d = a - b;
		if (d) {
			return d < 0 ? -1 : 1;
		}
		if (!a && !b) {
			return 0;
		}
	}
	return 0;
}
