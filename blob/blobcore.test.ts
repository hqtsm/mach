import { assertEquals } from '@std/assert';
import { BlobCore } from './blobcore.ts';
import { EINVAL, ENOMEM } from '../const.ts';

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
	assertEquals(blob.validateBlob(0x12345678), 0);
	assertEquals(blob.validateBlob(0x12345679), EINVAL);
	assertEquals(blob.validateBlob(0, 9), 0);
	assertEquals(blob.validateBlob(0, 10), 0);
	assertEquals(blob.validateBlob(0, 11), EINVAL);
	assertEquals(blob.validateBlob(0, 0, 9), ENOMEM);
	assertEquals(blob.validateBlob(0, 0, 10), 0);
	assertEquals(blob.validateBlob(0, 0, 11), 0);

	blob.initialize(0x12345678, 7);
	assertEquals(blob.validateBlob(0x12345678), EINVAL);
});
