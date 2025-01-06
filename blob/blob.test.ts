import { assertEquals } from '@std/assert';
import { Blob } from './blob.ts';

Deno.test('BYTE_LENGTH', () => {
	assertEquals(Blob.BYTE_LENGTH, 8);
});

Deno.test('blobify length', () => {
	const blobI = Blob.blobify(4);
	assertEquals(
		new Uint8Array(blobI.buffer),
		new Uint8Array([0, 0, 0, 0, 0, 0, 0, 12, 0, 0, 0, 0]),
	);
});

Deno.test('blobify buffer', () => {
	const blobB = Blob.blobify(new Uint8Array([1, 2, 3, 4]).buffer);
	assertEquals(
		new Uint8Array(blobB.buffer),
		new Uint8Array([0, 0, 0, 0, 0, 0, 0, 12, 1, 2, 3, 4]),
	);
});

Deno.test('blobify view', () => {
	const blobV = Blob.blobify(
		new Uint8Array([1, 2, 3, 4, 5, 6]).subarray(1, -1),
	);
	assertEquals(
		new Uint8Array(blobV.buffer),
		new Uint8Array([0, 0, 0, 0, 0, 0, 0, 12, 2, 3, 4, 5]),
	);
});
