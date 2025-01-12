import { assertEquals } from '@std/assert';
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
