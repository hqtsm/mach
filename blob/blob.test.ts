import { assertEquals, assertThrows } from '@std/assert';
import { type Class, constant } from '@hqtsm/class';
import { uint32BE } from '@hqtsm/struct';
import { Blob } from './blob.ts';

Deno.test('BYTE_LENGTH', () => {
	assertEquals(Blob.BYTE_LENGTH, 8);
});

Deno.test('blobify length', () => {
	const blobI = Blob.blobify(4);
	assertEquals(
		new Uint8Array(blobI),
		new Uint8Array([0, 0, 0, 0, 0, 0, 0, 12, 0, 0, 0, 0]),
	);
});

Deno.test('blobify buffer', () => {
	const blobB = Blob.blobify(new Uint8Array([1, 2, 3, 4]).buffer);
	assertEquals(
		new Uint8Array(blobB),
		new Uint8Array([0, 0, 0, 0, 0, 0, 0, 12, 1, 2, 3, 4]),
	);
});

Deno.test('blobify view', () => {
	const blobV = Blob.blobify(
		new Uint8Array([1, 2, 3, 4, 5, 6]).subarray(1, -1),
	);
	assertEquals(
		new Uint8Array(blobV),
		new Uint8Array([0, 0, 0, 0, 0, 0, 0, 12, 2, 3, 4, 5]),
	);
});

Deno.test('validateBlobLength', () => {
	class Example extends Blob {
		declare public readonly ['constructor']: Class<typeof Example>;

		/**
		 * Example value.
		 */
		declare public value: number;

		public static override readonly typeMagic = 0x12345678;

		static {
			uint32BE(this, 'value');
			constant(this, 'BYTE_LENGTH');
			constant(this, 'typeMagic');
		}
	}

	const data = new Uint8Array(22);
	const blob = new Example(data.buffer, 2);

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
