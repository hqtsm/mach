import { assertEquals, assertInstanceOf } from '@std/assert';
import { type Class, constant } from '@hqtsm/class';
import { uint32BE } from '@hqtsm/struct';
import { EINVAL } from '../const.ts';
import { Blob } from './blob.ts';
import { BlobCore } from './blobcore.ts';

class NoErrno {
	get errno(): number {
		throw new Error('Unused');
	}

	set errno(_value: number) {
		throw new Error('Unused');
	}
}

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

Deno.test('BYTE_LENGTH', () => {
	assertEquals(Blob.BYTE_LENGTH, 8);
});

Deno.test('specific', () => {
	const data = new Uint8Array(12);
	const blob = new BlobCore(data.buffer);
	{
		const context = { errno: 0 };
		assertEquals(Example.specific(blob, context), null);
		assertEquals(context.errno, EINVAL);
	}

	blob.initialize(Example.typeMagic, Example.BYTE_LENGTH);
	{
		const example = Example.specific(blob, new NoErrno());
		assertInstanceOf(example, Example);
	}
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

Deno.test('readBlob regular', async () => {
	const data = new Uint8Array(100);
	const blob = new Example(data.buffer);
	{
		const context = { errno: 0 };
		assertEquals(
			await Example.readBlob(new globalThis.Blob([data]), context),
			null,
		);
		assertEquals(context.errno, EINVAL);
	}

	blob.initializeLength(Example.BYTE_LENGTH);
	blob.value = 0xAABBCCDD;
	const context = { errno: 0 };
	const read = await Example.readBlob(new globalThis.Blob([data]), context);
	assertInstanceOf(read, Example);
	assertEquals(context.errno, 0);
	assertEquals(read.magic(), Example.typeMagic);
	assertEquals(read.length(), Example.BYTE_LENGTH);
	assertEquals(read.value, 0xAABBCCDD);
});

Deno.test('readBlob offset', async () => {
	const data = new Uint8Array(100);
	const blob = new Example(data.buffer, 10);
	{
		const context = { errno: 0 };
		assertEquals(
			await Example.readBlob(
				new globalThis.Blob([data]),
				10,
				Example.BYTE_LENGTH - 1,
				context,
			),
			null,
		);
		assertEquals(context.errno, EINVAL);
	}

	blob.initializeLength(Example.BYTE_LENGTH);
	blob.value = 0xAABBCCDD;
	const context = { errno: 0 };
	const read = await Example.readBlob(
		new globalThis.Blob([data]),
		10,
		0,
		context,
	);
	assertInstanceOf(read, Example);
	assertEquals(context.errno, 0);
	assertEquals(read.magic(), Example.typeMagic);
	assertEquals(read.length(), Example.BYTE_LENGTH);
	assertEquals(read.value, 0xAABBCCDD);
});

Deno.test('validateBlobLength', () => {
	const data = new Uint8Array(22);
	const blob = new Example(data.buffer, 2);

	blob.initialize(0, 20);
	{
		const context = { errno: 0 };
		assertEquals(blob.validateBlobLength(undefined, context), false);
		assertEquals(context.errno, EINVAL);
	}

	blob.initializeLength(20);
	assertEquals(blob.validateBlobLength(), true);

	blob.initializeLength(11);
	assertEquals(blob.validateBlobLength(11, new NoErrno()), false);

	blob.initialize(0, 20);
	{
		const context = { errno: 0 };
		assertEquals(blob.validateBlobLength(20, context), false);
		assertEquals(context.errno, EINVAL);
	}

	blob.initializeLength(20);
	assertEquals(blob.validateBlobLength(20, new NoErrno()), true);

	blob.initializeLength(19);
	assertEquals(blob.validateBlobLength(19, new NoErrno()), true);
});
