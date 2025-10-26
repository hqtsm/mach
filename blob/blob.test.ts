import { assertEquals, assertThrows } from '@std/assert';
import { constant, uint32BE } from '@hqtsm/struct';
import { type BlobConstructor, templateBlob } from './blob.ts';

const MAGIC = 0x12345678;

const Blob: BlobConstructor<
	BlobTest,
	typeof MAGIC
> = templateBlob(
	() => BlobTest,
	MAGIC,
);

class BlobTest extends Blob {
	declare public readonly ['constructor']: Omit<typeof BlobTest, 'new'>;

	/**
	 * Text value.
	 */
	declare public value: number;

	static {
		uint32BE(this, 'value');
		constant(this, 'BYTE_LENGTH');
		constant(this, 'typeMagic');
	}
}

Deno.test('BYTE_LENGTH', () => {
	assertEquals(BlobTest.BYTE_LENGTH, 12);
});

Deno.test('blobify length', () => {
	const blobI = BlobTest.blobify(4);
	assertEquals(
		new Uint8Array(blobI),
		new Uint8Array([0x12, 0x34, 0x56, 0x78, 0, 0, 0, 12, 0, 0, 0, 0]),
	);
});

Deno.test('blobify buffer', () => {
	const blobB = BlobTest.blobify(new Uint8Array([1, 2, 3, 4]).buffer);
	assertEquals(
		new Uint8Array(blobB),
		new Uint8Array([0x12, 0x34, 0x56, 0x78, 0, 0, 0, 12, 1, 2, 3, 4]),
	);
});

Deno.test('blobify view', () => {
	const blobV = Blob.blobify(
		new Uint8Array([1, 2, 3, 4, 5, 6]).subarray(1, -1),
	);
	assertEquals(
		new Uint8Array(blobV),
		new Uint8Array([0x12, 0x34, 0x56, 0x78, 0, 0, 0, 12, 2, 3, 4, 5]),
	);
});

Deno.test('is', () => {
	const blob = new Blob(Blob.blobify(new Uint8Array([1, 2, 3, 4]).buffer));
	assertEquals(blob.is(), true);
	blob.initialize(1);
	assertEquals(blob.is(), false);
});

Deno.test('validateBlobLength', () => {
	const data = new Uint8Array(22);
	const blob = new BlobTest(data.buffer, 2);

	blob.initialize(0, 20);
	assertThrows(
		() => blob.validateBlobLength(),
		RangeError,
		'Invalid magic',
	);

	blob.initializeLength(20);
	blob.validateBlobLength();

	blob.initializeLength(11);
	assertThrows(
		() => blob.validateBlobLength(11),
		RangeError,
		'Invalid length',
	);

	blob.initialize(0, 20);
	assertThrows(
		() => blob.validateBlobLength(20),
		RangeError,
		'Invalid magic',
	);

	blob.initializeLength(20);
	blob.validateBlobLength(20);
	assertThrows(
		() => blob.validateBlobLength(19),
		RangeError,
		'Invalid length',
	);
});
