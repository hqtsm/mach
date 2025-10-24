import { assertEquals, assertNotEquals, assertThrows } from '@std/assert';
import { BlobCore } from './blobcore.ts';

Deno.test('BYTE_LENGTH', () => {
	assertEquals(BlobCore.BYTE_LENGTH, 8);
});

Deno.test('magic', () => {
	const data = new Uint8Array([0x12, 0x34, 0x56, 0x78]);
	const blob = new BlobCore(data.buffer);
	assertEquals(blob.magic(), 0x12345678);
});

Deno.test('length', () => {
	const bw = new BlobCore(new ArrayBuffer(BlobCore.BYTE_LENGTH));
	assertEquals(bw.length(), 0);
	assertEquals(bw.length(16), undefined);
	assertEquals(bw.length(), 16);
});

Deno.test('data', () => {
	const data = new Uint8Array(12);
	const blob = new BlobCore(data.buffer, 2);
	assertEquals(blob.data().byteOffset, 2);
});

Deno.test('clone', () => {
	const data = new Uint8Array(12);
	const blob = new BlobCore(data.buffer, 2);
	const clone = blob.clone();
	assertEquals(clone.data().byteOffset, 0);
	new Uint8Array(clone.data().buffer).fill(1);
	assertEquals(data, new Uint8Array(12));
});

Deno.test('innerData', () => {
	const data = new Uint8Array(12);
	const blob = new BlobCore(data.buffer, 2);
	blob.length(10);
	const body = blob.innerData();
	assertEquals(body.length, 2);
	body[0] = 1;
	body[1] = 2;
	assertEquals(data.slice(10), new Uint8Array([1, 2]));
});

Deno.test('initialize', () => {
	const data = new Uint8Array(12);
	const blob = new BlobCore(data.buffer, 2);
	blob.initialize(0x12345678, 10);
	assertEquals(blob.magic(), 0x12345678);
	assertEquals(blob.length(), 10);
});

Deno.test('validateBlob', () => {
	const data = new Uint8Array(12);
	const blob = new BlobCore(data.buffer, 2);
	blob.initialize(0x12345678, 10);
	blob.validateBlob(0x12345678);
	assertThrows(
		() => blob.validateBlob(0x12345679),
		RangeError,
		'Invalid magic number',
	);
	blob.validateBlob(0, 9);
	blob.validateBlob(0, 10);
	assertThrows(
		() => blob.validateBlob(0, 11),
		RangeError,
		'Invalid minimum size',
	);
	assertThrows(
		() => blob.validateBlob(0, 0, 9),
		RangeError,
		'Invalid maximum size',
	);
	blob.validateBlob(0, 0, 10);
	blob.validateBlob(0, 0, 11);

	blob.initialize(0x12345678, 7);
	assertThrows(
		() => blob.validateBlob(0x12345678),
		RangeError,
		'Invalid minimum size',
	);
});

Deno.test('contains', () => {
	const data = new Uint8Array(12);
	const blob = new BlobCore(data.buffer, 2);
	blob.initialize(0x12345678, 10);
	assertEquals(blob.contains(0, 0), false);
	assertEquals(blob.contains(0, 1), false);
	assertEquals(blob.contains(0, 2), false);
	assertEquals(blob.contains(0, 3), false);
	assertEquals(blob.contains(0, 4), false);
	assertEquals(blob.contains(0, 5), false);
	assertEquals(blob.contains(0, 6), false);
	assertEquals(blob.contains(0, 7), false);
	assertEquals(blob.contains(0, 8), false);
	assertEquals(blob.contains(0, 9), false);
	assertEquals(blob.contains(0, 10), false);
	assertEquals(blob.contains(0, 11), false);
	assertEquals(blob.contains(0, 12), false);
	assertEquals(blob.contains(7, 1), false);
	assertEquals(blob.contains(8, 0), true);
	assertEquals(blob.contains(8, 1), true);
	assertEquals(blob.contains(8, 2), true);
	assertEquals(blob.contains(8, 3), false);
	assertEquals(blob.contains(9, 1), true);
	assertEquals(blob.contains(10, 0), true);
	assertEquals(blob.contains(9, -1), false);
	assertEquals(blob.contains(10, -1), false);
});

Deno.test('stringAt', () => {
	const data = new Uint8Array(22);
	const blob = new BlobCore(data.buffer, 2);
	blob.initialize(0x12345678, 20);

	assertEquals(blob.stringAt(-1), null);
	assertEquals(blob.stringAt(20), null);

	let s = blob.stringAt(0);
	assertNotEquals(s, null);
	assertEquals(s![0], 0x12);
	assertEquals(s![1], 0x34);
	assertEquals(s![2], 0x56);
	assertEquals(s![3], 0x78);
	assertEquals(s![4], 0);

	s = blob.stringAt(8);
	assertNotEquals(s, null);
	assertEquals(s![0], 0);

	s = blob.stringAt(19);
	assertNotEquals(s, null);
	assertEquals(s![0], 0);

	data[blob.byteOffset + 10] = 'A'.charCodeAt(0);
	data[blob.byteOffset + 11] = 'B'.charCodeAt(0);
	data[blob.byteOffset + 12] = 'C'.charCodeAt(0);

	s = blob.stringAt(10);
	assertNotEquals(s, null);
	assertEquals(s![0], 'A'.charCodeAt(0));
	assertEquals(s![1], 'B'.charCodeAt(0));
	assertEquals(s![2], 'C'.charCodeAt(0));
	assertEquals(s![3], 0);

	data[blob.byteOffset + 17] = 'A'.charCodeAt(0);
	data[blob.byteOffset + 18] = 'B'.charCodeAt(0);
	data[blob.byteOffset + 19] = 'C'.charCodeAt(0);

	assertEquals(blob.stringAt(17), null);
});
