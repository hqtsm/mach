import { assert, assertEquals, assertInstanceOf } from '@std/assert';
import { constant } from '@hqtsm/class';
import { Uint8Ptr } from '@hqtsm/struct';
import { ENOMEM } from '../libc/errno.ts';
import { assertThrowsUnixError } from '../spec/assert.ts';
import { testOOM } from '../spec/memory.ts';
import { BlobCore, BlobWrapper } from './blob.ts';
import {
	SuperBlob,
	SuperBlob_Maker,
	SuperBlobCore,
	SuperBlobCoreIndex,
} from './superblob.ts';

const MAGIC = 0x12345678;

class ExampleCore<
	TArrayBuffer extends ArrayBufferLike = ArrayBufferLike,
> extends SuperBlobCore<TArrayBuffer> {
	public static override readonly typeMagic = MAGIC;

	static {
		constant(this, 'typeMagic');
	}
}

class Example<
	TArrayBuffer extends ArrayBufferLike = ArrayBufferLike,
> extends SuperBlob<TArrayBuffer> {
	public static override readonly typeMagic = MAGIC;

	static {
		constant(this, 'typeMagic');
	}
}

class ExampleMaker extends SuperBlob_Maker {
	public static override readonly SuperBlob: typeof Example<ArrayBuffer> =
		Example;

	static {
		constant(this, 'SuperBlob');
	}
}

Deno.test('SuperBlobCoreIndex: BYTE_LENGTH', () => {
	assertEquals(SuperBlobCoreIndex.BYTE_LENGTH, 8);
});

Deno.test('SuperBlobCore: count', () => {
	const data = new ArrayBuffer(100);
	const example = new ExampleCore(data);
	ExampleCore.setup(example, 12 + 2 * 8, 2);
	assertEquals(ExampleCore.count(example), 2);
});

Deno.test('SuperBlobCore: type', () => {
	const data = new ArrayBuffer(100);
	const view = new DataView(data);
	const example = new ExampleCore(data);
	ExampleCore.setup(example, 12 + 2 * 8, 2);
	view.setUint32(12, 0x11111111);
	view.setUint32(20, 0x22222222);
	assertEquals(ExampleCore.type(example, 0), 0x11111111);
	assertEquals(ExampleCore.type(example, 1), 0x22222222);
});

Deno.test('SuperBlobCore: blob', () => {
	const data = new ArrayBuffer(100);
	const view = new DataView(data);
	const example = new ExampleCore(data);
	ExampleCore.setup(example, 12 + 2 * 8 + 8, 2);
	view.setUint32(12, 0x11111111);
	view.setUint32(20, 0x22222222);
	view.setUint32(24, 12 + 2 * 8);
	view.setUint32(28, 0x11223344);
	view.setUint32(32, 8);
	assertEquals(ExampleCore.blob(example, 0), null);
	const blob = ExampleCore.blob(example, 1);
	assertInstanceOf(blob, BlobCore);
	assertEquals(BlobCore.magic(blob), 0x11223344);
	assertEquals(BlobCore.size(blob), 8);
});

Deno.test('SuperBlobCore: find', () => {
	const data = new ArrayBuffer(100);
	const view = new DataView(data);
	const example = new ExampleCore(data);
	ExampleCore.setup(example, 12 + 2 * 8 + 8, 2);
	view.setUint32(12, 0x11111111);
	view.setUint32(20, 0x22222222);
	view.setUint32(24, 12 + 2 * 8);
	view.setUint32(28, 0x11223344);
	view.setUint32(32, 8);
	assertEquals(ExampleCore.find(example, 0x11111111), null);
	const blob = ExampleCore.find(example, 0x22222222);
	assertInstanceOf(blob, BlobCore);
	assertEquals(BlobCore.magic(blob), 0x11223344);
	assertEquals(BlobCore.size(blob), 8);
});

Deno.test('SuperBlob: BYTE_LENGTH', () => {
	assertEquals(SuperBlob.BYTE_LENGTH, 12);
});

Deno.test('SuperBlob: type', () => {
	const maker = new ExampleMaker();
	const data = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]);
	const blob = BlobWrapper.alloc(data, data.byteLength);
	ExampleMaker.add(maker, 0x01020304, blob);
	ExampleMaker.add(maker, 0x10203040, blob);
	const sb = ExampleMaker.make(maker);
	assertEquals(Example.type(sb, 0), 0x01020304);
	assertEquals(Example.type(sb, 1), 0x10203040);
});

Deno.test('SuperBlob: blob', () => {
	const maker = new ExampleMaker();
	const data1 = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]);
	const data2 = new Uint8Array([2, 3, 4, 5, 6, 7, 8, 9]);
	const blob1 = BlobWrapper.alloc(data1, data1.byteLength);
	const blob2 = BlobWrapper.alloc(data2, data2.byteLength);
	ExampleMaker.add(maker, 1, blob1);
	ExampleMaker.add(maker, 2, blob2);
	const sb = ExampleMaker.make(maker);
	const get1 = Example.blob(sb, 0)!;
	const get2 = Example.blob(sb, 1)!;

	assertEquals(
		new Uint8Array(get1.buffer, get1.byteOffset, BlobCore.size(get1)),
		new Uint8Array(blob1.buffer, 0, 16),
	);

	// No offset means null. What would create this?
	new DataView(sb.buffer).setUint32(16, 0);
	assertEquals(Example.blob(sb, 0), null);

	assertEquals(
		new Uint8Array(get2.buffer, get2.byteOffset, BlobCore.size(get2)),
		new Uint8Array(blob2.buffer, 0, 16),
	);
});

Deno.test('SuperBlob: find', () => {
	const maker = new ExampleMaker();
	const data1 = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]);
	const data2 = new Uint8Array([2, 3, 4, 5, 6, 7, 8, 9]);
	const blob1 = BlobWrapper.alloc(data1, data1.byteLength);
	const blob2 = BlobWrapper.alloc(data2, data2.byteLength);
	ExampleMaker.add(maker, 1, blob1);
	ExampleMaker.add(maker, 2, blob2);
	const sb = ExampleMaker.make(maker);
	const get1 = Example.find(sb, 1)!;
	const get2 = Example.find(sb, 2)!;
	const get3 = Example.find(sb, 3)!;
	assertEquals(
		new Uint8Array(get1.buffer, get1.byteOffset, BlobCore.size(get1)),
		new Uint8Array(blob1.buffer, 0, 16),
	);
	assertEquals(
		new Uint8Array(get2.buffer, get2.byteOffset, BlobCore.size(get2)),
		new Uint8Array(blob2.buffer, 0, 16),
	);
	assertEquals(get3, null);
});

Deno.test('SuperBlob: count', () => {
	const maker = new ExampleMaker();
	const data1 = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]);
	const data2 = new Uint8Array([2, 3, 4, 5, 6, 7, 8, 9]);
	const blob1 = BlobWrapper.alloc(data1, data1.byteLength);
	const blob2 = BlobWrapper.alloc(data2, data2.byteLength);
	ExampleMaker.add(maker, 1, blob1);
	ExampleMaker.add(maker, 2, blob1);
	ExampleMaker.add(maker, 2, blob2);
	const sb = ExampleMaker.make(maker);
	assertEquals(Example.count(sb), 2);
});

Deno.test('SuperBlobMaker: add BlobCore', () => {
	const maker = new ExampleMaker();
	const data = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]);
	const blob = BlobWrapper.alloc(data, data.byteLength);
	ExampleMaker.add(maker, 0x01020304, blob);
	const sb = ExampleMaker.make(maker);
	assertEquals(new Uint8Array(sb.buffer, 20), new Uint8Array(blob.buffer));
});

Deno.test('SuperBlobMaker: add SuperBlob', () => {
	const maker1 = new ExampleMaker();
	const data = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]);
	ExampleMaker.add(
		maker1,
		0x11111111,
		BlobWrapper.alloc(data, data.byteLength),
	);
	ExampleMaker.add(
		maker1,
		0x22222222,
		BlobWrapper.alloc(data, data.byteLength),
	);
	const maker2 = new ExampleMaker();
	ExampleMaker.add(maker2, ExampleMaker.make(maker1));
	const sb2 = ExampleMaker.make(maker2);
	assertEquals(Example.count(sb2), 2);
	assertEquals(Example.type(sb2, 0), 0x11111111);
	assertEquals(Example.type(sb2, 1), 0x22222222);
	BlobCore.at(Example.blob(sb2, 0)!, Uint8Ptr, 8)[0] = 11;
	BlobCore.at(Example.blob(sb2, 1)!, Uint8Ptr, 8)[0] = 12;
	assertEquals(
		BlobCore.at(
			Example.blob(ExampleMaker.make(maker1), 0)!,
			Uint8Ptr,
			8,
		)[0],
		1,
	);
	assertEquals(
		BlobCore.at(
			Example.blob(ExampleMaker.make(maker1), 1)!,
			Uint8Ptr,
			8,
		)[0],
		1,
	);
});

Deno.test('SuperBlobMaker: add SuperBlobMaker', () => {
	const maker1 = new ExampleMaker();
	const data = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]);
	ExampleMaker.add(
		maker1,
		0x11111111,
		BlobWrapper.alloc(data, data.byteLength),
	);
	ExampleMaker.add(
		maker1,
		0x22222222,
		BlobWrapper.alloc(data, data.byteLength),
	);
	const maker2 = new ExampleMaker();
	ExampleMaker.add(maker2, maker1);
	const sb2 = ExampleMaker.make(maker2);
	assertEquals(Example.count(sb2), 2);
	assertEquals(Example.type(sb2, 0), 0x11111111);
	assertEquals(Example.type(sb2, 1), 0x22222222);
	BlobCore.at(Example.blob(sb2, 0)!, Uint8Ptr, 8)[0] = 11;
	BlobCore.at(Example.blob(sb2, 1)!, Uint8Ptr, 8)[0] = 12;
	assertEquals(
		BlobCore.at(
			Example.blob(ExampleMaker.make(maker1), 0)!,
			Uint8Ptr,
			8,
		)[0],
		1,
	);
	assertEquals(
		BlobCore.at(
			Example.blob(ExampleMaker.make(maker1), 1)!,
			Uint8Ptr,
			8,
		)[0],
		1,
	);
});

Deno.test('SuperBlobMaker: contains', () => {
	const maker = new ExampleMaker();
	const data = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]);
	const blob = BlobWrapper.alloc(data, data.byteLength);
	assertEquals(ExampleMaker.contains(maker, 0x01020304), false);
	ExampleMaker.add(maker, 0x01020304, blob);
	assertEquals(ExampleMaker.contains(maker, 0x01020304), true);
});

Deno.test('SuperBlobMaker: get', () => {
	const maker = new ExampleMaker();
	const data = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]);
	const blob = BlobWrapper.alloc(data, data.byteLength);
	assertEquals(ExampleMaker.get(maker, 0x01020304), null);
	ExampleMaker.add(maker, 0x01020304, blob);
	assert(ExampleMaker.get(maker, 0x01020304));
});

Deno.test('SuperBlobMaker: size', () => {
	const maker = new ExampleMaker();
	assertEquals(ExampleMaker.size(maker, []), 12);
	assertEquals(
		Example.size(ExampleMaker.make(maker)),
		ExampleMaker.size(maker, []),
	);
	const data = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]);
	const blob = BlobWrapper.alloc(data, data.byteLength);
	ExampleMaker.add(maker, 1, blob);
	assertEquals(ExampleMaker.size(maker, []), 36);
	assertEquals(
		Example.size(ExampleMaker.make(maker)),
		ExampleMaker.size(maker, []),
	);
	ExampleMaker.add(maker, 1, blob);
	assertEquals(ExampleMaker.size(maker, []), 36);
	assertEquals(
		Example.size(ExampleMaker.make(maker)),
		ExampleMaker.size(maker, []),
	);
	ExampleMaker.add(maker, 2, blob);
	assertEquals(ExampleMaker.size(maker, []), 60);
	assertEquals(
		Example.size(ExampleMaker.make(maker)),
		ExampleMaker.size(maker, []),
	);
	assertEquals(ExampleMaker.size(maker, [4, 8]), 88);
	assertEquals(
		Example.size(ExampleMaker.make(maker)),
		ExampleMaker.size(maker, []),
	);
	assertEquals(ExampleMaker.size(maker, [4, 8], 4, 8), 116);
	assertEquals(
		Example.size(ExampleMaker.make(maker)),
		ExampleMaker.size(maker, []),
	);
});

Deno.test('SuperBlobMaker: make', () => {
	const maker = new ExampleMaker();
	const size = ExampleMaker.size(maker, []);
	testOOM([size], () => {
		assertThrowsUnixError(
			() => ExampleMaker.make(maker),
			ENOMEM,
		);
	});
});
