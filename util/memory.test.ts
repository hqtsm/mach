import {
	assertEquals,
	assertInstanceOf,
	assertStrictEquals,
} from '@std/assert';
import {
	asUint8Array,
	isSharedArrayBuffer,
	toUint8ArrayArrayBuffer,
} from './memory.ts';

Deno.test('isSharedArrayBuffer', () => {
	assertEquals(isSharedArrayBuffer(new SharedArrayBuffer(0)), true);
	assertEquals(isSharedArrayBuffer(new ArrayBuffer(0)), false);
});

Deno.test('asUint8Array', () => {
	const ab = new ArrayBuffer(4);
	new Uint8Array(ab).set([1, 2, 3, 4]);
	const uab = new Uint8Array(ab, 1, 2);

	assertStrictEquals(asUint8Array(ab).buffer, ab);
	assertEquals(asUint8Array(ab).byteOffset, 0);
	assertEquals(asUint8Array(ab).byteLength, 4);
	assertStrictEquals(asUint8Array(uab).buffer, ab);
	assertEquals(asUint8Array(uab).byteOffset, 1);
	assertEquals(asUint8Array(uab).byteLength, 2);
	assertEquals(asUint8Array(uab, 1).byteLength, 1);

	const sab = new SharedArrayBuffer(4);
	new Uint8Array(sab).set([5, 6, 7, 8]);
	const usab = new Uint8Array(sab, 1, 2);

	assertStrictEquals(asUint8Array(sab).buffer, sab);
	assertEquals(asUint8Array(sab).byteOffset, 0);
	assertEquals(asUint8Array(sab).byteLength, 4);
	assertStrictEquals(asUint8Array(usab).buffer, sab);
	assertEquals(asUint8Array(usab).byteOffset, 1);
	assertEquals(asUint8Array(usab).byteLength, 2);
	assertEquals(asUint8Array(usab, 1).byteLength, 1);
});

Deno.test('toUint8ArrayArrayBuffer', () => {
	const ab = new ArrayBuffer(4);
	new Uint8Array(ab).set([1, 2, 3, 4]);
	const ab2u8ab = toUint8ArrayArrayBuffer(ab, 1, 2);
	assertStrictEquals(ab2u8ab.buffer, ab);
	assertEquals(ab2u8ab.byteOffset, 1);
	assertEquals(ab2u8ab.byteLength, 2);
	assertEquals(new Uint8Array(ab2u8ab), new Uint8Array([2, 3]));

	const sab = new SharedArrayBuffer(4);
	new Uint8Array(sab).set([5, 6, 7, 8]);
	const sab2u8ab = toUint8ArrayArrayBuffer(sab, 1, 2);
	assertInstanceOf(sab2u8ab.buffer, ArrayBuffer);
	assertEquals(sab2u8ab.byteOffset, 0);
	assertEquals(sab2u8ab.byteLength, 2);
	assertEquals(new Uint8Array(sab2u8ab), new Uint8Array([6, 7]));
});
