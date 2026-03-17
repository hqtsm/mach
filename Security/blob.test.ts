import {
	assertEquals,
	assertInstanceOf,
	assertNotEquals,
	assertThrows,
} from '@std/assert';
import { type Class, constant } from '@hqtsm/class';
import { uint32BE } from '@hqtsm/struct';
import { CSMAGIC_BLOBWRAPPER } from '../kern/cs_blobs.ts';
import { EINVAL, ENOMEM } from '../libc/errno.ts';
import { unhex } from '../spec/hex.ts';
import { Blob, BlobCore, BlobWrapper } from './blob.ts';
import { MacOSError, UnixError } from './errors.ts';
import { errSecAllocate } from './SecBase.ts';

Deno.test('BlobCore: BYTE_LENGTH', () => {
	assertEquals(BlobCore.BYTE_LENGTH, 8);
});

Deno.test('BlobCore: magic', () => {
	const data = new Uint8Array([0x12, 0x34, 0x56, 0x78]);
	const blob = new BlobCore(data.buffer);
	assertEquals(BlobCore.magic(blob), 0x12345678);
});

Deno.test('BlobCore: length', () => {
	const bw = new BlobCore(new ArrayBuffer(BlobCore.BYTE_LENGTH));
	assertEquals(BlobCore.size(bw), 0);
	assertEquals(BlobCore.size(bw, 16), undefined);
	assertEquals(BlobCore.size(bw), 16);
});

Deno.test('BlobCore: data', () => {
	const data = new Uint8Array(12);
	const blob = new BlobCore(data.buffer, 2);
	assertEquals(BlobCore.data(blob).byteOffset, 2);
});

Deno.test('BlobCore: clone', () => {
	const data = new Uint8Array(12);
	const blob = new BlobCore(data.buffer, 2);
	const clone = BlobCore.clone(blob);
	assertInstanceOf(clone, BlobCore);
	assertEquals(BlobCore.data(clone).byteOffset, 0);
	new Uint8Array(BlobCore.data(clone).buffer).fill(1);
	assertEquals(data, new Uint8Array(12));
	{
		BlobCore.size(blob, 0xDEADDEAD);
		const desc = Object.getOwnPropertyDescriptor(
			globalThis,
			'ArrayBuffer',
		)!;
		Object.defineProperty(globalThis, 'ArrayBuffer', {
			...desc,
			value: new Proxy(desc.value, {
				construct(target: () => unknown, args: unknown[]): object {
					if (args[0] === 0xDEADDEAD) {
						throw new RangeError('TEST-OOM');
					}
					return Reflect.construct(target, args);
				},
			}),
		});
		try {
			const err = assertThrows(
				() => BlobCore.clone(blob),
				UnixError,
				new UnixError(ENOMEM, false).message,
			);
			assertEquals(err.error, ENOMEM);
		} finally {
			Object.defineProperty(globalThis, 'ArrayBuffer', desc);
		}
	}
});

Deno.test('BlobCore: innerData', () => {
	const data = new Uint8Array(12);
	const blob = new BlobCore(data.buffer, 2);
	BlobCore.size(blob, 10);
	const inner = BlobCore.innerData(blob);
	data[10] = 1;
	data[11] = 2;
	assertEquals(inner.length, 2);
	assertEquals(inner[0], 1);
	assertEquals(inner[1], 2);
});

Deno.test('BlobCore: initialize', () => {
	const data = new Uint8Array(12);
	const blob = new BlobCore(data.buffer, 2);
	BlobCore.initialize(blob, 0x12345678, 10);
	assertEquals(BlobCore.magic(blob), 0x12345678);
	assertEquals(BlobCore.size(blob), 10);
});

Deno.test('BlobCore: validateBlob', () => {
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

Deno.test('BlobCore: contains', () => {
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

Deno.test('BlobCore: stringAt', () => {
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

Deno.test('BlobCore: is', () => {
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

Deno.test('BlobCore: readBlob', async () => {
	assertEquals(
		await BlobCore.readBlob(new globalThis.Blob([new Uint8Array(7)])),
		null,
	);

	const data = new Uint8Array(100);
	const blob = new BlobCore(data.buffer);
	BlobCore.initialize(blob, 0x12345678, 101);
	{
		const context = { errno: 0 };
		await BlobCore.readBlob(new globalThis.Blob([data]), context);
		assertEquals(context.errno, EINVAL);
	}

	BlobCore.initialize(blob, 0x12345678, 100);
	const read = await BlobCore.readBlob(new globalThis.Blob([data]));
	assertNotEquals(read, null);
	assertEquals(BlobCore.magic(read!), 0x12345678);
	assertEquals(BlobCore.size(read!), 100);
});

class NoErrno {
	get errno(): number {
		throw new Error('Unused');
	}

	set errno(_value: number) {
		throw new Error('Unused');
	}
}

class ExampleBlob extends Blob {
	declare public readonly ['constructor']: Class<typeof ExampleBlob>;

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

Deno.test('Blob: BYTE_LENGTH', () => {
	assertEquals(Blob.BYTE_LENGTH, 8);
});

Deno.test('Blob: specific', () => {
	const data = new Uint8Array(12);
	const blob = new BlobCore(data.buffer);
	{
		const context = { errno: 0 };
		assertEquals(ExampleBlob.specific(blob, context), null);
		assertEquals(context.errno, EINVAL);
	}

	BlobCore.initialize(blob, ExampleBlob.typeMagic, ExampleBlob.BYTE_LENGTH);
	{
		const example = ExampleBlob.specific(blob, new NoErrno());
		assertInstanceOf(example, ExampleBlob);
	}
});

Deno.test('Blob: clone', () => {
	const data = new Uint8Array(12);
	const example = new ExampleBlob(data.buffer);
	BlobCore.initialize(example, 0xFFFFFFFF, ExampleBlob.BYTE_LENGTH);
	example.value = 42;
	{
		const context = { errno: 0 };
		assertEquals(ExampleBlob.clone(example, context), null);
		assertEquals(context.errno, EINVAL);
	}

	ExampleBlob.initializeSize(example, ExampleBlob.BYTE_LENGTH);
	{
		const clone = ExampleBlob.clone(example, new NoErrno());
		assertInstanceOf(clone, ExampleBlob);
		assertEquals(clone.value, 42);
	}
});

Deno.test('Blob: blobify buffer', () => {
	const blobB = Blob.blobify(new Uint8Array([1, 2, 3, 4]).buffer);
	assertEquals(
		new Uint8Array(blobB),
		new Uint8Array([0, 0, 0, 0, 0, 0, 0, 12, 1, 2, 3, 4]),
	);
});

Deno.test('Blob: blobify view', () => {
	const blobV = Blob.blobify(
		new Uint8Array([1, 2, 3, 4, 5, 6]).subarray(1, -1),
	);
	assertEquals(
		new Uint8Array(blobV),
		new Uint8Array([0, 0, 0, 0, 0, 0, 0, 12, 2, 3, 4, 5]),
	);
});

Deno.test('Blob: blobify error', () => {
	const content = new ArrayBuffer(0xDEAD);
	const desc = Object.getOwnPropertyDescriptor(globalThis, 'ArrayBuffer')!;
	Object.defineProperty(globalThis, 'ArrayBuffer', {
		...desc,
		value: new Proxy(desc.value, {
			construct(target: () => unknown, args: unknown[]): object {
				if (args[0] === BlobCore.BYTE_LENGTH + 0xDEAD) {
					throw new RangeError('TEST-OOM');
				}
				return Reflect.construct(target, args);
			},
		}),
	});
	try {
		const err = assertThrows(
			() => Blob.blobify(content),
			MacOSError,
			new MacOSError(errSecAllocate).message,
		);
		assertEquals(err.error, errSecAllocate);
	} finally {
		Object.defineProperty(globalThis, 'ArrayBuffer', desc);
	}
	Blob.blobify(content);
});

Deno.test('Blob: readBlob regular', async () => {
	const data = new Uint8Array(100);
	const blob = new ExampleBlob(data.buffer);
	{
		const context = { errno: 0 };
		assertEquals(
			await ExampleBlob.readBlob(new globalThis.Blob([data]), context),
			null,
		);
		assertEquals(context.errno, EINVAL);
	}

	ExampleBlob.initializeSize(blob, ExampleBlob.BYTE_LENGTH);
	blob.value = 0xAABBCCDD;
	const context = { errno: 0 };
	const read = await ExampleBlob.readBlob(
		new globalThis.Blob([data]),
		context,
	);
	assertInstanceOf(read, ExampleBlob);
	assertEquals(context.errno, 0);
	assertEquals(ExampleBlob.magic(read), ExampleBlob.typeMagic);
	assertEquals(ExampleBlob.size(read), ExampleBlob.BYTE_LENGTH);
	assertEquals(read.value, 0xAABBCCDD);
});

Deno.test('Blob: readBlob offset', async () => {
	const data = new Uint8Array(100);
	const blob = new ExampleBlob(data.buffer, 10);
	{
		const context = { errno: 0 };
		assertEquals(
			await ExampleBlob.readBlob(
				new globalThis.Blob([data]),
				10,
				ExampleBlob.BYTE_LENGTH - 1,
				context,
			),
			null,
		);
		assertEquals(context.errno, EINVAL);
	}

	ExampleBlob.initializeSize(blob, ExampleBlob.BYTE_LENGTH);
	blob.value = 0xAABBCCDD;
	const context = { errno: 0 };
	const read = await ExampleBlob.readBlob(
		new globalThis.Blob([data]),
		10,
		0,
		context,
	);
	assertInstanceOf(read, ExampleBlob);
	assertEquals(context.errno, 0);
	assertEquals(ExampleBlob.magic(read), ExampleBlob.typeMagic);
	assertEquals(ExampleBlob.size(read), ExampleBlob.BYTE_LENGTH);
	assertEquals(read.value, 0xAABBCCDD);
});

Deno.test('Blob: validateBlobSize', () => {
	const data = new Uint8Array(22);
	const blob = new ExampleBlob(data.buffer, 2);

	BlobCore.initialize(blob, 0, 20);
	{
		const context = { errno: 0 };
		assertEquals(
			ExampleBlob.validateBlobSize(blob, context),
			false,
		);
		assertEquals(context.errno, EINVAL);
	}

	ExampleBlob.initializeSize(blob, 20);
	assertEquals(ExampleBlob.validateBlobSize(blob), true);

	ExampleBlob.initializeSize(blob, 11);
	assertEquals(ExampleBlob.validateBlobSize(blob, 11, new NoErrno()), false);

	BlobCore.initialize(blob, 0, 20);
	{
		const context = { errno: 0 };
		assertEquals(ExampleBlob.validateBlobSize(blob, 20, context), false);
		assertEquals(context.errno, EINVAL);
	}

	ExampleBlob.initializeSize(blob, 20);
	assertEquals(ExampleBlob.validateBlobSize(blob, 20, new NoErrno()), true);

	ExampleBlob.initializeSize(blob, 19);
	assertEquals(ExampleBlob.validateBlobSize(blob, 19, new NoErrno()), true);
});

Deno.test('BlobWrapper: BYTE_LENGTH', () => {
	assertEquals(BlobWrapper.BYTE_LENGTH, 8);
});

Deno.test('BlobWrapper: length', () => {
	const bw = new BlobWrapper(new ArrayBuffer(BlobWrapper.BYTE_LENGTH));
	assertEquals(BlobWrapper.length(bw), -8);
	assertEquals(BlobWrapper.length(bw, 8), undefined);
	assertEquals(BlobWrapper.length(bw), 0);
	assertEquals(BlobWrapper.length(bw, 16), undefined);
	assertEquals(BlobWrapper.length(bw), 8);
});

Deno.test('BlobWrapper: empty', () => {
	const { BYTE_LENGTH } = BlobWrapper;
	const buffer = new ArrayBuffer(BYTE_LENGTH);
	const bw = new BlobWrapper(buffer);
	BlobWrapper.initializeSize(bw, BYTE_LENGTH);
	assertEquals(
		new Uint8Array(buffer),
		unhex('FA DE 0B 01 00 00 00 08'),
	);
});

Deno.test('BlobWrapper: alloc length', () => {
	const data = unhex('09 AB CD EF 01 02 03 04 05 06 07 08 09 0A 0B 0C');
	const bw = BlobWrapper.alloc(data.length);
	let ptr = BlobWrapper.data(bw);
	new Uint8Array(ptr.buffer, ptr.byteOffset).set(data);
	const dv = new DataView(bw.buffer, bw.byteOffset, 8);
	assertEquals(dv.getUint32(0), CSMAGIC_BLOBWRAPPER);
	assertEquals(dv.getUint32(4), BlobWrapper.length(bw) + 8);
	ptr = BlobWrapper.data(bw);
	assertEquals(
		new Uint8Array(ptr.buffer, ptr.byteOffset, BlobWrapper.length(bw)),
		data,
	);
});

Deno.test('BlobWrapper: alloc size', () => {
	const data = new Uint8Array(16);
	const bw = BlobWrapper.alloc(data.byteLength);
	const dv = new DataView(bw.buffer, bw.byteOffset, 8);
	assertEquals(dv.getUint32(0), CSMAGIC_BLOBWRAPPER);
	assertEquals(dv.getUint32(4), BlobWrapper.length(bw) + 8);
	const ptr = BlobWrapper.data(bw);
	assertEquals(
		new Uint8Array(ptr.buffer, ptr.byteOffset, BlobWrapper.length(bw)),
		data,
	);
});

Deno.test('BlobWrapper: alloc buffer', () => {
	const data = unhex('09 AB CD EF 01 02 03 04 05 06 07 08 09 0A 0B 0C');
	const bw = BlobWrapper.alloc(data.buffer, data.byteLength);
	const dv = new DataView(bw.buffer, bw.byteOffset, 8);
	assertEquals(dv.getUint32(0), CSMAGIC_BLOBWRAPPER);
	assertEquals(dv.getUint32(4), BlobWrapper.length(bw) + 8);
	const ptr = BlobWrapper.data(bw);
	assertEquals(
		new Uint8Array(ptr.buffer, ptr.byteOffset, BlobWrapper.length(bw)),
		data,
	);
});

Deno.test('BlobWrapper: alloc view', () => {
	const data = unhex('09 AB CD EF 01 02 03 04 05 06 07 08 09 0A 0B 0C');
	const view = new Uint8Array([1, ...data, 1]).subarray(1, -1);
	const bw = BlobWrapper.alloc(view, view.byteLength);
	const dv = new DataView(bw.buffer, bw.byteOffset, 8);
	assertEquals(dv.getUint32(0), CSMAGIC_BLOBWRAPPER);
	assertEquals(dv.getUint32(4), BlobWrapper.length(bw) + 8);
	const ptr = BlobWrapper.data(bw);
	assertEquals(
		new Uint8Array(ptr.buffer, ptr.byteOffset, BlobWrapper.length(bw)),
		data,
	);
});
