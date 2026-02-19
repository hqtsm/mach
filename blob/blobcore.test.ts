import { assertEquals, assertInstanceOf, assertNotEquals } from '@std/assert';
import { BlobCore } from './blobcore.ts';
import { EINVAL, ENOMEM } from '../const.ts';

Deno.test('BYTE_LENGTH', () => {
	assertEquals(BlobCore.BYTE_LENGTH, 8);
});

Deno.test('magic', () => {
	const data = new Uint8Array([0x12, 0x34, 0x56, 0x78]);
	const blob = new BlobCore(data.buffer);
	assertEquals(BlobCore.magic(blob), 0x12345678);
});

Deno.test('length', () => {
	const bw = new BlobCore(new ArrayBuffer(BlobCore.BYTE_LENGTH));
	assertEquals(BlobCore.size(bw), 0);
	assertEquals(BlobCore.size(bw, 16), undefined);
	assertEquals(BlobCore.size(bw), 16);
});

Deno.test('data', () => {
	const data = new Uint8Array(12);
	const blob = new BlobCore(data.buffer, 2);
	assertEquals(BlobCore.data(blob).byteOffset, 2);
});

Deno.test('clone', () => {
	const data = new Uint8Array(12);
	const blob = new BlobCore(data.buffer, 2);
	const clone = BlobCore.clone(blob);
	assertInstanceOf(clone, BlobCore);
	assertEquals(BlobCore.data(clone).byteOffset, 0);
	new Uint8Array(BlobCore.data(clone).buffer).fill(1);
	assertEquals(data, new Uint8Array(12));
});

Deno.test('innerData', () => {
	const data = new Uint8Array(12);
	const blob = new BlobCore(data.buffer, 2);
	BlobCore.size(blob, 10);
	const bodyA = BlobCore.innerData(blob);
	data[10] = 1;
	data[11] = 2;
	const bodyB = BlobCore.innerData(blob);
	assertEquals(bodyA.byteLength, 2);
	assertEquals(new Uint8Array(bodyA), new Uint8Array([0, 0]));
	assertEquals(bodyB.byteLength, 2);
	assertEquals(new Uint8Array(bodyB), new Uint8Array([1, 2]));
});

Deno.test('initialize', () => {
	const data = new Uint8Array(12);
	const blob = new BlobCore(data.buffer, 2);
	BlobCore.initialize(blob, 0x12345678, 10);
	assertEquals(BlobCore.magic(blob), 0x12345678);
	assertEquals(BlobCore.size(blob), 10);
});

Deno.test('validateBlob', () => {
	const data = new Uint8Array(12);
	const blob = new BlobCore(data.buffer, 2);
	BlobCore.initialize(blob, 0x12345678, 10);
	assertEquals(BlobCore.validateBlob(blob, 0x12345678), true);
	{
		const context = { errno: 0 };
		assertEquals(
			BlobCore.validateBlob(
				blob,
				0x12345678,
				undefined,
				undefined,
				context,
			),
			true,
		);
		assertEquals(context.errno, 0);
	}

	{
		const context = { errno: 0 };
		assertEquals(
			BlobCore.validateBlob(
				blob,
				0x12345679,
				undefined,
				undefined,
				context,
			),
			false,
		);
		assertEquals(context.errno, EINVAL);
	}

	assertEquals(BlobCore.validateBlob(blob, 0, 9), true);
	assertEquals(BlobCore.validateBlob(blob, 0, 10), true);

	{
		const context = { errno: 0 };
		assertEquals(
			BlobCore.validateBlob(blob, 0, 11, undefined, context),
			false,
		);
		assertEquals(context.errno, EINVAL);
	}

	{
		const context = { errno: 0 };
		assertEquals(BlobCore.validateBlob(blob, 0, 0, 9, context), false);
		assertEquals(context.errno, ENOMEM);
	}
	assertEquals(BlobCore.validateBlob(blob, 0, 0, 10), true);
	assertEquals(BlobCore.validateBlob(blob, 0, 0, 11), true);

	BlobCore.initialize(blob, 0x12345678, 7);
	{
		const context = { errno: 0 };
		assertEquals(
			BlobCore.validateBlob(
				blob,
				0x12345678,
				undefined,
				undefined,
				context,
			),
			false,
		);
		assertEquals(context.errno, EINVAL);
	}
});

Deno.test('contains', () => {
	const data = new Uint8Array(12);
	const blob = new BlobCore(data.buffer, 2);
	BlobCore.initialize(blob, 0x12345678, 10);
	assertEquals(BlobCore.contains(blob, 0, 0), false);
	assertEquals(BlobCore.contains(blob, 0, 1), false);
	assertEquals(BlobCore.contains(blob, 0, 2), false);
	assertEquals(BlobCore.contains(blob, 0, 3), false);
	assertEquals(BlobCore.contains(blob, 0, 4), false);
	assertEquals(BlobCore.contains(blob, 0, 5), false);
	assertEquals(BlobCore.contains(blob, 0, 6), false);
	assertEquals(BlobCore.contains(blob, 0, 7), false);
	assertEquals(BlobCore.contains(blob, 0, 8), false);
	assertEquals(BlobCore.contains(blob, 0, 9), false);
	assertEquals(BlobCore.contains(blob, 0, 10), false);
	assertEquals(BlobCore.contains(blob, 0, 11), false);
	assertEquals(BlobCore.contains(blob, 0, 12), false);
	assertEquals(BlobCore.contains(blob, 7, 1), false);
	assertEquals(BlobCore.contains(blob, 8, 0), true);
	assertEquals(BlobCore.contains(blob, 8, 1), true);
	assertEquals(BlobCore.contains(blob, 8, 2), true);
	assertEquals(BlobCore.contains(blob, 8, 3), false);
	assertEquals(BlobCore.contains(blob, 9, 1), true);
	assertEquals(BlobCore.contains(blob, 10, 0), true);
	assertEquals(BlobCore.contains(blob, 9, -1), false);
	assertEquals(BlobCore.contains(blob, 10, -1), false);
});

Deno.test('stringAt', () => {
	const data = new Uint8Array(22);
	const blob = new BlobCore(data.buffer, 2);
	BlobCore.initialize(blob, 0x12345678, 20);

	assertEquals(BlobCore.stringAt(blob, -1), null);
	assertEquals(BlobCore.stringAt(blob, 20), null);

	let s = BlobCore.stringAt(blob, 0);
	assertNotEquals(s, null);
	assertEquals(s![0], 0x12);
	assertEquals(s![1], 0x34);
	assertEquals(s![2], 0x56);
	assertEquals(s![3], 0x78);
	assertEquals(s![4], 0);

	s = BlobCore.stringAt(blob, 8);
	assertNotEquals(s, null);
	assertEquals(s![0], 0);

	s = BlobCore.stringAt(blob, 19);
	assertNotEquals(s, null);
	assertEquals(s![0], 0);

	data[blob.byteOffset + 10] = 'A'.charCodeAt(0);
	data[blob.byteOffset + 11] = 'B'.charCodeAt(0);
	data[blob.byteOffset + 12] = 'C'.charCodeAt(0);

	s = BlobCore.stringAt(blob, 10);
	assertNotEquals(s, null);
	assertEquals(s![0], 'A'.charCodeAt(0));
	assertEquals(s![1], 'B'.charCodeAt(0));
	assertEquals(s![2], 'C'.charCodeAt(0));
	assertEquals(s![3], 0);

	data[blob.byteOffset + 17] = 'A'.charCodeAt(0);
	data[blob.byteOffset + 18] = 'B'.charCodeAt(0);
	data[blob.byteOffset + 19] = 'C'.charCodeAt(0);

	assertEquals(BlobCore.stringAt(blob, 17), null);
});

Deno.test('is', () => {
	const data = new ArrayBuffer(12);
	const view = new DataView(data);
	view.setUint32(0, 0x12345678);
	view.setUint32(4, 12);
	view.setUint8(8, 1);
	view.setUint8(9, 2);
	view.setUint8(10, 3);
	view.setUint8(11, 4);

	const blob = new BlobCore(data);

	class Match extends BlobCore {
		static typeMagic = 0x12345678;
	}
	assertEquals(Match.is(blob), true);

	class Mismatch extends BlobCore {
		static typeMagic = 0x12345679;
	}
	assertEquals(Mismatch.is(blob), false);
});

Deno.test('readBlob', async () => {
	assertEquals(
		await BlobCore.readBlob(new Blob([new Uint8Array(7)])),
		null,
	);

	const data = new Uint8Array(100);
	const blob = new BlobCore(data.buffer);
	BlobCore.initialize(blob, 0x12345678, 101);
	{
		const context = { errno: 0 };
		await BlobCore.readBlob(new Blob([data]), context);
		assertEquals(context.errno, EINVAL);
	}

	BlobCore.initialize(blob, 0x12345678, 100);
	const read = await BlobCore.readBlob(new Blob([data]));
	assertNotEquals(read, null);
	assertEquals(BlobCore.magic(read!), 0x12345678);
	assertEquals(BlobCore.size(read!), 100);
});
