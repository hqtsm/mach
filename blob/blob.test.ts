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

	BlobCore.initialize(blob, Example.typeMagic, Example.BYTE_LENGTH);
	{
		const example = Example.specific(blob, new NoErrno());
		assertInstanceOf(example, Example);
	}
});

Deno.test('clone', () => {
	const data = new Uint8Array(12);
	const example = new Example(data.buffer);
	BlobCore.initialize(example, 0xFFFFFFFF, Example.BYTE_LENGTH);
	example.value = 42;
	{
		const context = { errno: 0 };
		assertEquals(Example.clone(example, context), null);
		assertEquals(context.errno, EINVAL);
	}

	Example.initializeSize(example, Example.BYTE_LENGTH);
	{
		const clone = Example.clone(example, new NoErrno());
		assertInstanceOf(clone, Example);
		assertEquals(clone.value, 42);
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

	Example.initializeSize(blob, Example.BYTE_LENGTH);
	blob.value = 0xAABBCCDD;
	const context = { errno: 0 };
	const read = await Example.readBlob(new globalThis.Blob([data]), context);
	assertInstanceOf(read, Example);
	assertEquals(context.errno, 0);
	assertEquals(Example.magic(read), Example.typeMagic);
	assertEquals(Example.size(read), Example.BYTE_LENGTH);
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

	Example.initializeSize(blob, Example.BYTE_LENGTH);
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
	assertEquals(Example.magic(read), Example.typeMagic);
	assertEquals(Example.size(read), Example.BYTE_LENGTH);
	assertEquals(read.value, 0xAABBCCDD);
});

Deno.test('validateBlobLength', () => {
	const data = new Uint8Array(22);
	const blob = new Example(data.buffer, 2);

	BlobCore.initialize(blob, 0, 20);
	{
		const context = { errno: 0 };
		assertEquals(
			Example.validateBlobSize(blob, undefined, context),
			false,
		);
		assertEquals(context.errno, EINVAL);
	}

	Example.initializeSize(blob, 20);
	assertEquals(Example.validateBlobSize(blob), true);

	Example.initializeSize(blob, 11);
	assertEquals(Example.validateBlobSize(blob, 11, new NoErrno()), false);

	BlobCore.initialize(blob, 0, 20);
	{
		const context = { errno: 0 };
		assertEquals(Example.validateBlobSize(blob, 20, context), false);
		assertEquals(context.errno, EINVAL);
	}

	Example.initializeSize(blob, 20);
	assertEquals(Example.validateBlobSize(blob, 20, new NoErrno()), true);

	Example.initializeSize(blob, 19);
	assertEquals(Example.validateBlobSize(blob, 19, new NoErrno()), true);
});
