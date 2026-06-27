import {
	assertEquals,
	assertInstanceOf,
	assertStrictEquals,
} from '@std/assert';
import {
	bufferToBytes,
	isArrayBuffer,
	pointerBytes,
	pointerToBytes,
	viewBytes,
	viewToBytes,
} from './memory.ts';

Deno.test('isArrayBuffer', () => {
	assertEquals(isArrayBuffer(new ArrayBuffer()), true);
	assertEquals(isArrayBuffer(new SharedArrayBuffer()), false);
	assertEquals(isArrayBuffer(new ArrayBuffer()), true);
	assertEquals(isArrayBuffer(new SharedArrayBuffer()), false);
});

Deno.test('pointerBytes', () => {
	const ab = new ArrayBuffer(4);
	new Uint8Array(ab).set([1, 2, 3, 4]);
	const uab = new Uint8Array(ab, 1, 2);

	assertEquals(pointerBytes(ab, 1).byteLength, 1);
	assertEquals(pointerBytes(uab, 1).byteLength, 1);

	const sab = new SharedArrayBuffer(4);
	new Uint8Array(sab).set([5, 6, 7, 8]);
	const usab = new Uint8Array(sab, 1, 2);

	assertEquals(pointerBytes(sab, 1).byteLength, 1);
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

Deno.test('bufferBytes', () => {
	const ab = new ArrayBuffer(4);
	new Uint8Array(ab).set([1, 2, 3, 4]);
	const ab2u8ab = bufferToBytes(ab, 1, 2);
	assertStrictEquals(ab2u8ab.buffer, ab);
	assertEquals(ab2u8ab.byteOffset, 1);
	assertEquals(ab2u8ab.byteLength, 2);
	assertEquals(new Uint8Array(ab2u8ab), new Uint8Array([2, 3]));

	const sab = new SharedArrayBuffer(4);
	new Uint8Array(sab).set([5, 6, 7, 8]);
	const sab2u8ab = bufferToBytes(sab, 1, 2);
	assertInstanceOf(sab2u8ab.buffer, ArrayBuffer);
	assertEquals(sab2u8ab.byteOffset, 0);
	assertEquals(sab2u8ab.byteLength, 2);
	assertEquals(new Uint8Array(sab2u8ab), new Uint8Array([6, 7]));
});

Deno.test('pointerToBytes', () => {
	const ab = new ArrayBuffer(4);
	new Uint8Array(ab).set([1, 2, 3, 4]);
	const uab = new Uint8Array(ab, 1, 2);

	assertEquals(pointerToBytes(ab, 1).byteLength, 1);
	assertStrictEquals(pointerToBytes(uab, 1).buffer, ab);
	assertEquals(pointerToBytes(uab, 1).byteLength, 1);
	assertEquals(pointerToBytes(uab, 1).byteOffset, 1);

	const sab = new SharedArrayBuffer(4);
	new Uint8Array(sab).set([5, 6, 7, 8]);
	const usab = new Uint8Array(sab, 1, 2);

	assertEquals(pointerToBytes(ab, 1).byteLength, 1);
	assertInstanceOf(pointerToBytes(usab, 1).buffer, ArrayBuffer);
	assertEquals(pointerToBytes(usab, 1).byteLength, 1);
	assertEquals(pointerToBytes(usab, 1).byteOffset, 0);
});

Deno.test('viewToBytes', () => {
	const ab = new ArrayBuffer(4);
	new Uint8Array(ab).set([1, 2, 3, 4]);
	const uab = new Uint8Array(ab, 1, 2);

	assertStrictEquals(viewToBytes(ab).buffer, ab);
	assertEquals(viewToBytes(ab).byteOffset, 0);
	assertEquals(viewToBytes(ab).byteLength, 4);
	assertStrictEquals(viewToBytes(uab).buffer, ab);
	assertEquals(viewToBytes(uab).byteOffset, 1);
	assertEquals(viewToBytes(uab).byteLength, 2);

	const sab = new SharedArrayBuffer(4);
	new Uint8Array(sab).set([5, 6, 7, 8]);
	const usab = new Uint8Array(sab, 1, 2);

	assertInstanceOf(viewToBytes(sab).buffer, ArrayBuffer);
	assertEquals(viewToBytes(sab).byteOffset, 0);
	assertEquals(viewToBytes(sab).byteLength, 4);
	assertInstanceOf(viewToBytes(usab).buffer, ArrayBuffer);
	assertEquals(viewToBytes(usab).byteOffset, 0);
	assertEquals(viewToBytes(usab).byteLength, 2);
});
