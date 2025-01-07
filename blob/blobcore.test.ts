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
	const ptr = blob.data;
	assertEquals(ptr.byteOffset, 2);
});
