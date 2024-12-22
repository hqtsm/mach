import { assertEquals } from '@std/assert';
import { Blob } from './blob.ts';

Deno.test('BYTE_LENGTH', () => {
	assertEquals(Blob.BYTE_LENGTH, 8);
});

Deno.test('blobify', () => {
	const blob = Blob.blobify(4);
	assertEquals(
		new Uint8Array(blob.buffer),
		new Uint8Array([0, 0, 0, 0, 0, 0, 0, 12, 0, 0, 0, 0]),
	);
});
