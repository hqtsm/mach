import {
	assertEquals,
	assertInstanceOf,
	assertNotEquals,
	assertThrows,
} from '@std/assert';
import { constant } from '@hqtsm/class';
import { uint32BE } from '@hqtsm/struct';
import { CSMAGIC_BLOBWRAPPER } from '../kern/cs_blobs.ts';
import { EINVAL, ENOMEM } from '../libc/errno.ts';
import {
	assertThrowsMacOSError,
	assertThrowsUnixError,
} from '../spec/assert.ts';
import { unhex } from '../spec/hex.ts';
import { testOOM } from '../spec/memory.ts';
import {
	Security_Blob,
	Security_BlobCore,
	Security_BlobWrapper,
} from './blob.ts';
import { errSecAllocate } from './SecBase.ts';

Deno.test('Security_BlobCore: BYTE_LENGTH', () => {
	assertEquals(Security_BlobCore.BYTE_LENGTH, 8);
});

Deno.test('Security_BlobCore: magic', () => {
	const data = new Uint8Array([0x12, 0x34, 0x56, 0x78]);
	const blob = new Security_BlobCore(data.buffer);
	assertEquals(Security_BlobCore.magic(blob), 0x12345678);
});

Deno.test('Security_BlobCore: length', () => {
	const bw = new Security_BlobCore(
		new ArrayBuffer(Security_BlobCore.BYTE_LENGTH),
	);
	assertEquals(Security_BlobCore.size(bw), 0);
	assertEquals(Security_BlobCore.size(bw, 16), undefined);
	assertEquals(Security_BlobCore.size(bw), 16);
});

Deno.test('Security_BlobCore: data', () => {
	const data = new Uint8Array(12);
	const blob = new Security_BlobCore(data.buffer, 2);
	assertEquals(Security_BlobCore.data(blob).byteOffset, 2);
});

Deno.test('Security_BlobCore: clone', () => {
	const data = new Uint8Array(12);
	const blob = new Security_BlobCore(data.buffer, 2);
	const clone = Security_BlobCore.clone(blob);
	assertInstanceOf(clone, Security_BlobCore);
	assertEquals(Security_BlobCore.data(clone).byteOffset, 0);
	new Uint8Array(Security_BlobCore.data(clone).buffer).fill(1);
	assertEquals(data, new Uint8Array(12));

	Security_BlobCore.size(blob, 0xDEADDEAD);
	testOOM([0xDEADDEAD], () => {
		assertThrowsUnixError(
			() => Security_BlobCore.clone(blob),
			ENOMEM,
		);
	});
});

Deno.test('Security_BlobCore: innerData', () => {
	const data = new Uint8Array(12);
	const blob = new Security_BlobCore(data.buffer, 2);
	Security_BlobCore.size(blob, 10);
	const inner = Security_BlobCore.innerData(blob);
	data[10] = 1;
	data[11] = 2;
	assertEquals(inner.length, 2);
	assertEquals(inner[0], 1);
	assertEquals(inner[1], 2);
});

Deno.test('Security_BlobCore: initialize', () => {
	const data = new Uint8Array(12);
	const blob = new Security_BlobCore(data.buffer, 2);
	Security_BlobCore.initialize(blob, 0x12345678, 10);
	assertEquals(Security_BlobCore.magic(blob), 0x12345678);
	assertEquals(Security_BlobCore.size(blob), 10);
});

Deno.test('Security_BlobCore: validateBlob', () => {
	const data = new Uint8Array(12);
	const blob = new Security_BlobCore(data.buffer, 2);
	Security_BlobCore.initialize(blob, 0x12345678, 10);
	assertEquals(Security_BlobCore.validateBlob(blob, 0x12345678), true);
	{
		const context = { errno: 0 };
		assertEquals(
			Security_BlobCore.validateBlob(
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
			Security_BlobCore.validateBlob(
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

	assertEquals(Security_BlobCore.validateBlob(blob, 0, 9), true);
	assertEquals(Security_BlobCore.validateBlob(blob, 0, 10), true);

	{
		const context = { errno: 0 };
		assertEquals(
			Security_BlobCore.validateBlob(blob, 0, 11, undefined, context),
			false,
		);
		assertEquals(context.errno, EINVAL);
	}

	{
		const context = { errno: 0 };
		assertEquals(
			Security_BlobCore.validateBlob(blob, 0, 0, 9, context),
			false,
		);
		assertEquals(context.errno, ENOMEM);
	}
	assertEquals(Security_BlobCore.validateBlob(blob, 0, 0, 10), true);
	assertEquals(Security_BlobCore.validateBlob(blob, 0, 0, 11), true);

	Security_BlobCore.initialize(blob, 0x12345678, 7);
	{
		const context = { errno: 0 };
		assertEquals(
			Security_BlobCore.validateBlob(
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

Deno.test('Security_BlobCore: contains', () => {
	const data = new Uint8Array(12);
	const blob = new Security_BlobCore(data.buffer, 2);
	Security_BlobCore.initialize(blob, 0x12345678, 10);
	assertEquals(Security_BlobCore.contains(blob, 0, 0), false);
	assertEquals(Security_BlobCore.contains(blob, 0, 1), false);
	assertEquals(Security_BlobCore.contains(blob, 0, 2), false);
	assertEquals(Security_BlobCore.contains(blob, 0, 3), false);
	assertEquals(Security_BlobCore.contains(blob, 0, 4), false);
	assertEquals(Security_BlobCore.contains(blob, 0, 5), false);
	assertEquals(Security_BlobCore.contains(blob, 0, 6), false);
	assertEquals(Security_BlobCore.contains(blob, 0, 7), false);
	assertEquals(Security_BlobCore.contains(blob, 0, 8), false);
	assertEquals(Security_BlobCore.contains(blob, 0, 9), false);
	assertEquals(Security_BlobCore.contains(blob, 0, 10), false);
	assertEquals(Security_BlobCore.contains(blob, 0, 11), false);
	assertEquals(Security_BlobCore.contains(blob, 0, 12), false);
	assertEquals(Security_BlobCore.contains(blob, 7, 1), false);
	assertEquals(Security_BlobCore.contains(blob, 8, 0), true);
	assertEquals(Security_BlobCore.contains(blob, 8, 1), true);
	assertEquals(Security_BlobCore.contains(blob, 8, 2), true);
	assertEquals(Security_BlobCore.contains(blob, 8, 3), false);
	assertEquals(Security_BlobCore.contains(blob, 9, 1), true);
	assertEquals(Security_BlobCore.contains(blob, 10, 0), true);
	assertEquals(Security_BlobCore.contains(blob, 9, -1), false);
	assertEquals(Security_BlobCore.contains(blob, 10, -1), false);
});

Deno.test('Security_BlobCore: stringAt', () => {
	const data = new Uint8Array(22);
	const blob = new Security_BlobCore(data.buffer, 2);
	Security_BlobCore.initialize(blob, 0x12345678, 20);

	assertEquals(Security_BlobCore.stringAt(blob, -1), null);
	assertEquals(Security_BlobCore.stringAt(blob, 20), null);

	let s = Security_BlobCore.stringAt(blob, 0);
	assertNotEquals(s, null);
	assertEquals(s![0], 0x12);
	assertEquals(s![1], 0x34);
	assertEquals(s![2], 0x56);
	assertEquals(s![3], 0x78);
	assertEquals(s![4], 0);

	s = Security_BlobCore.stringAt(blob, 8);
	assertNotEquals(s, null);
	assertEquals(s![0], 0);

	s = Security_BlobCore.stringAt(blob, 19);
	assertNotEquals(s, null);
	assertEquals(s![0], 0);

	data[blob.byteOffset + 10] = 'A'.charCodeAt(0);
	data[blob.byteOffset + 11] = 'B'.charCodeAt(0);
	data[blob.byteOffset + 12] = 'C'.charCodeAt(0);

	s = Security_BlobCore.stringAt(blob, 10);
	assertNotEquals(s, null);
	assertEquals(s![0], 'A'.charCodeAt(0));
	assertEquals(s![1], 'B'.charCodeAt(0));
	assertEquals(s![2], 'C'.charCodeAt(0));
	assertEquals(s![3], 0);

	data[blob.byteOffset + 17] = 'A'.charCodeAt(0);
	data[blob.byteOffset + 18] = 'B'.charCodeAt(0);
	data[blob.byteOffset + 19] = 'C'.charCodeAt(0);

	assertEquals(Security_BlobCore.stringAt(blob, 17), null);
});

Deno.test('Security_BlobCore: is', () => {
	const data = new ArrayBuffer(12);
	const view = new DataView(data);
	view.setUint32(0, 0x12345678);
	view.setUint32(4, 12);
	view.setUint8(8, 1);
	view.setUint8(9, 2);
	view.setUint8(10, 3);
	view.setUint8(11, 4);

	const blob = new Security_BlobCore(data);

	class Match extends Security_BlobCore {
		static typeMagic = 0x12345678;
	}
	assertEquals(Match.is(blob), true);

	class Mismatch extends Security_BlobCore {
		static typeMagic = 0x12345679;
	}
	assertEquals(Mismatch.is(blob), false);
});

Deno.test('Security_BlobCore: readBlob', async () => {
	assertEquals(
		await Security_BlobCore.readBlob(new Blob([new Uint8Array(7)])),
		null,
	);

	const data = new Uint8Array(100);
	const blob = new Security_BlobCore(data.buffer);
	Security_BlobCore.initialize(blob, 0x12345678, 101);
	{
		const context = { errno: 0 };
		await Security_BlobCore.readBlob(new Blob([data]), context);
		assertEquals(context.errno, EINVAL);
	}

	Security_BlobCore.initialize(blob, 0x12345678, 100);
	const read = await Security_BlobCore.readBlob(new Blob([data]));
	assertNotEquals(read, null);
	assertEquals(Security_BlobCore.magic(read!), 0x12345678);
	assertEquals(Security_BlobCore.size(read!), 100);
});

class NoErrno {
	get errno(): number {
		throw new Error('Unused');
	}

	set errno(_value: number) {
		throw new Error('Unused');
	}
}

class ExampleBlob extends Security_Blob {
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

Deno.test('Security_Blob: BYTE_LENGTH', () => {
	assertEquals(Security_Blob.BYTE_LENGTH, 8);
});

Deno.test('Security_Blob: specific', () => {
	const data = new Uint8Array(12);
	const blob = new Security_BlobCore(data.buffer);
	{
		const context = { errno: 0 };
		assertEquals(ExampleBlob.specific(blob, context), null);
		assertEquals(context.errno, EINVAL);
	}

	Security_BlobCore.initialize(
		blob,
		ExampleBlob.typeMagic,
		ExampleBlob.BYTE_LENGTH,
	);
	{
		const example = ExampleBlob.specific(blob, new NoErrno());
		assertInstanceOf(example, ExampleBlob);
	}
});

Deno.test('Security_Blob: clone', () => {
	const data = new Uint8Array(12);
	const example = new ExampleBlob(data.buffer);
	Security_BlobCore.initialize(example, 0xFFFFFFFF, ExampleBlob.BYTE_LENGTH);
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

Deno.test('Security_Blob: blobify buffer', () => {
	const blobB = Security_Blob.blobify(new Uint8Array([1, 2, 3, 4]).buffer);
	assertEquals(
		new Uint8Array(blobB.buffer),
		new Uint8Array([0, 0, 0, 0, 0, 0, 0, 12, 1, 2, 3, 4]),
	);
});

Deno.test('Security_Blob: blobify view', () => {
	const blobV = Security_Blob.blobify(
		new Uint8Array([1, 2, 3, 4, 5, 6]).subarray(1, -1),
	);
	assertEquals(
		new Uint8Array(blobV.buffer),
		new Uint8Array([0, 0, 0, 0, 0, 0, 0, 12, 2, 3, 4, 5]),
	);
});

Deno.test('Security_Blob: blobify OOM', () => {
	const content = new ArrayBuffer(0xDEAD);
	testOOM([Security_BlobCore.BYTE_LENGTH + 0xDEAD], () => {
		const err = assertThrowsMacOSError(
			() => Security_Blob.blobify(content),
			errSecAllocate,
		);
		assertEquals(err.error, errSecAllocate);
	});
});

Deno.test('Security_Blob: blobify exception', () => {
	const content = new ArrayBuffer(0xDEAD);
	testOOM([Security_BlobCore.BYTE_LENGTH + 0xDEAD], () => {
		assertThrows(
			() => Security_Blob.blobify(content),
			Error,
		);
	}, Error);
});

Deno.test('Security_Blob: readBlob regular', async () => {
	const data = new Uint8Array(100);
	const blob = new ExampleBlob(data.buffer);
	{
		const context = { errno: 0 };
		assertEquals(
			await ExampleBlob.readBlob(new Blob([data]), context),
			null,
		);
		assertEquals(context.errno, EINVAL);
	}

	ExampleBlob.initializeSize(blob, ExampleBlob.BYTE_LENGTH);
	blob.value = 0xAABBCCDD;
	const context = { errno: 0 };
	const read = await ExampleBlob.readBlob(new Blob([data]), context);
	assertInstanceOf(read, ExampleBlob);
	assertEquals(context.errno, 0);
	assertEquals(ExampleBlob.magic(read), ExampleBlob.typeMagic);
	assertEquals(ExampleBlob.size(read), ExampleBlob.BYTE_LENGTH);
	assertEquals(read.value, 0xAABBCCDD);
});

Deno.test('Security_Blob: readBlob offset', async () => {
	const data = new Uint8Array(100);
	const blob = new ExampleBlob(data.buffer, 10);
	{
		const context = { errno: 0 };
		assertEquals(
			await ExampleBlob.readBlob(
				new Blob([data]),
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
	const read = await ExampleBlob.readBlob(new Blob([data]), 10, 0, context);
	assertInstanceOf(read, ExampleBlob);
	assertEquals(context.errno, 0);
	assertEquals(ExampleBlob.magic(read), ExampleBlob.typeMagic);
	assertEquals(ExampleBlob.size(read), ExampleBlob.BYTE_LENGTH);
	assertEquals(read.value, 0xAABBCCDD);
});

Deno.test('Security_Blob: validateBlobSize', () => {
	const data = new Uint8Array(22);
	const blob = new ExampleBlob(data.buffer, 2);

	Security_BlobCore.initialize(blob, 0, 20);
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

	Security_BlobCore.initialize(blob, 0, 20);
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

Deno.test('Security_BlobWrapper: BYTE_LENGTH', () => {
	assertEquals(Security_BlobWrapper.BYTE_LENGTH, 8);
});

Deno.test('Security_BlobWrapper: length', () => {
	const bw = new Security_BlobWrapper(
		new ArrayBuffer(Security_BlobWrapper.BYTE_LENGTH),
	);
	assertEquals(Security_BlobWrapper.size(bw), -8);
	assertEquals(Security_BlobWrapper.size(bw, 8), undefined);
	assertEquals(Security_BlobWrapper.size(bw), 0);
	assertEquals(Security_BlobWrapper.size(bw, 16), undefined);
	assertEquals(Security_BlobWrapper.size(bw), 8);
});

Deno.test('Security_BlobWrapper: empty', () => {
	const { BYTE_LENGTH } = Security_BlobWrapper;
	const buffer = new ArrayBuffer(BYTE_LENGTH);
	const bw = new Security_BlobWrapper(buffer);
	Security_BlobWrapper.initializeSize(bw, BYTE_LENGTH);
	assertEquals(
		new Uint8Array(buffer),
		unhex('FA DE 0B 01 00 00 00 08'),
	);
});

Deno.test('Security_BlobWrapper: alloc length', () => {
	const data = unhex('09 AB CD EF 01 02 03 04 05 06 07 08 09 0A 0B 0C');
	const bw = Security_BlobWrapper.alloc(data.length);
	let ptr = Security_BlobWrapper.data(bw);
	new Uint8Array(ptr.buffer, ptr.byteOffset).set(data);
	const dv = new DataView(bw.buffer, bw.byteOffset, 8);
	assertEquals(dv.getUint32(0), CSMAGIC_BLOBWRAPPER);
	assertEquals(dv.getUint32(4), Security_BlobWrapper.size(bw) + 8);
	ptr = Security_BlobWrapper.data(bw);
	assertEquals(
		new Uint8Array(
			ptr.buffer,
			ptr.byteOffset,
			Security_BlobWrapper.size(bw),
		),
		data,
	);
});

Deno.test('Security_BlobWrapper: alloc size', () => {
	const data = new Uint8Array(16);
	const bw = Security_BlobWrapper.alloc(data.byteLength);
	const dv = new DataView(bw.buffer, bw.byteOffset, 8);
	assertEquals(dv.getUint32(0), CSMAGIC_BLOBWRAPPER);
	assertEquals(dv.getUint32(4), Security_BlobWrapper.size(bw) + 8);
	const ptr = Security_BlobWrapper.data(bw);
	assertEquals(
		new Uint8Array(
			ptr.buffer,
			ptr.byteOffset,
			Security_BlobWrapper.size(bw),
		),
		data,
	);
});

Deno.test('Security_BlobWrapper: alloc buffer', () => {
	const data = unhex('09 AB CD EF 01 02 03 04 05 06 07 08 09 0A 0B 0C');
	const bw = Security_BlobWrapper.alloc(data.buffer, data.byteLength);
	const dv = new DataView(bw.buffer, bw.byteOffset, 8);
	assertEquals(dv.getUint32(0), CSMAGIC_BLOBWRAPPER);
	assertEquals(dv.getUint32(4), Security_BlobWrapper.size(bw) + 8);
	const ptr = Security_BlobWrapper.data(bw);
	assertEquals(
		new Uint8Array(
			ptr.buffer,
			ptr.byteOffset,
			Security_BlobWrapper.size(bw),
		),
		data,
	);
});

Deno.test('Security_BlobWrapper: alloc view', () => {
	const data = unhex('09 AB CD EF 01 02 03 04 05 06 07 08 09 0A 0B 0C');
	const view = new Uint8Array([1, ...data, 1]).subarray(1, -1);
	const bw = Security_BlobWrapper.alloc(view, view.byteLength);
	const dv = new DataView(bw.buffer, bw.byteOffset, 8);
	assertEquals(dv.getUint32(0), CSMAGIC_BLOBWRAPPER);
	assertEquals(dv.getUint32(4), Security_BlobWrapper.size(bw) + 8);
	const ptr = Security_BlobWrapper.data(bw);
	assertEquals(
		new Uint8Array(
			ptr.buffer,
			ptr.byteOffset,
			Security_BlobWrapper.size(bw),
		),
		data,
	);
});
