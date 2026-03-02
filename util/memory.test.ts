import {
	assertEquals,
	assertInstanceOf,
	assertStrictEquals,
} from '@std/assert';
import {
	alignUp,
	isSharedArrayBuffer,
	toUint8ArrayArrayBuffer,
} from './memory.ts';

Deno.test('alignUp unsigned', () => {
	assertEquals(alignUp(0, 4), 0);
	assertEquals(alignUp(1, 4), 4);
	assertEquals(alignUp(2, 4), 4);
	assertEquals(alignUp(3, 4), 4);
	assertEquals(alignUp(4, 4), 4);
	assertEquals(alignUp(5, 4), 8);
	assertEquals(alignUp(6, 4), 8);
	assertEquals(alignUp(7, 4), 8);
	assertEquals(alignUp(8, 4), 8);
	assertEquals(alignUp(9, 4), 12);
	assertEquals(alignUp(10, 4), 12);
	assertEquals(alignUp(11, 4), 12);
	assertEquals(alignUp(12, 4), 12);
	assertEquals(alignUp(13, 4), 16);
	assertEquals(alignUp(14, 4), 16);
	assertEquals(alignUp(15, 4), 16);
	assertEquals(alignUp(16, 4), 16);
	assertEquals(alignUp(17, 4), 20);
	assertEquals(alignUp(18, 4), 20);
	assertEquals(alignUp(19, 4), 20);
	assertEquals(alignUp(20, 4), 20);
});

Deno.test('isSharedArrayBuffer', () => {
	assertEquals(isSharedArrayBuffer(new SharedArrayBuffer(0)), true);
	assertEquals(isSharedArrayBuffer(new ArrayBuffer(0)), false);
});

Deno.test('toUint8ArrayArrayBuffer', () => {
	const ab = new ArrayBuffer(4);
	new Uint8Array(ab).set([1, 2, 3, 4]);
	const sab = new SharedArrayBuffer(4);
	new Uint8Array(sab).set([1, 2, 3, 4]);

	const ab2u8ab = toUint8ArrayArrayBuffer(ab, 1, 2);
	assertStrictEquals(ab2u8ab.buffer, ab);
	assertEquals(ab2u8ab.byteOffset, 1);
	assertEquals(ab2u8ab.byteLength, 2);
	assertEquals(new Uint8Array(ab2u8ab), new Uint8Array([2, 3]));

	const sab2u8ab = toUint8ArrayArrayBuffer(sab, 1, 2);
	assertInstanceOf(sab2u8ab.buffer, ArrayBuffer);
	assertEquals(sab2u8ab.byteOffset, 0);
	assertEquals(sab2u8ab.byteLength, 2);
	assertEquals(new Uint8Array(sab2u8ab), new Uint8Array([2, 3]));
});
