import {
	assertEquals,
	assertInstanceOf,
	assertStrictEquals,
} from '@std/assert';
import {
	isSharedArrayBuffer,
	pointerBytes,
	toUint8ArrayArrayBuffer,
	viewBytes,
} from './memory.ts';

Deno.test('isSharedArrayBuffer', () => {
	assertEquals(isSharedArrayBuffer(new SharedArrayBuffer(0)), true);
	assertEquals(isSharedArrayBuffer(new ArrayBuffer(0)), false);
});

Deno.test('pointerBytes', () => {
	const ab = new ArrayBuffer(4);
	new Uint8Array(ab).set([1, 2, 3, 4]);
	const uab = new Uint8Array(ab, 1, 2);

	assertEquals(pointerBytes(uab, 1).byteLength, 1);

	const sab = new SharedArrayBuffer(4);
	new Uint8Array(sab).set([5, 6, 7, 8]);
	const usab = new Uint8Array(sab, 1, 2);

	assertEquals(pointerBytes(usab, 1).byteLength, 1);
});

Deno.test('viewBytes', () => {
	const ab = new ArrayBuffer(4);
	new Uint8Array(ab).set([1, 2, 3, 4]);
	const uab = new Uint8Array(ab, 1, 2);

	assertStrictEquals(viewBytes(ab).buffer, ab);
	assertEquals(viewBytes(ab).byteOffset, 0);
	assertEquals(viewBytes(ab).byteLength, 4);
	assertStrictEquals(viewBytes(uab).buffer, ab);
	assertEquals(viewBytes(uab).byteOffset, 1);
	assertEquals(viewBytes(uab).byteLength, 2);

	const sab = new SharedArrayBuffer(4);
	new Uint8Array(sab).set([5, 6, 7, 8]);
	const usab = new Uint8Array(sab, 1, 2);

	assertStrictEquals(viewBytes(sab).buffer, sab);
	assertEquals(viewBytes(sab).byteOffset, 0);
	assertEquals(viewBytes(sab).byteLength, 4);
	assertStrictEquals(viewBytes(usab).buffer, sab);
	assertEquals(viewBytes(usab).byteOffset, 1);
	assertEquals(viewBytes(usab).byteLength, 2);
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
