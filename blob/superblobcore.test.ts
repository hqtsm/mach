import { assert, assertEquals } from '@std/assert';
import { constant, Uint8Ptr } from '@hqtsm/struct';
import { BlobWrapper } from './blobwrapper.ts';
import {
	type SuperBlobCoreConstructor,
	templateSuperBlobCore,
} from './superblobcore.ts';

const MAGIC = 0x12345678;

const SuperBlobCore: SuperBlobCoreConstructor<
	SuperBlobCoreTest,
	typeof MAGIC
> = templateSuperBlobCore(
	() => SuperBlobCoreTest,
	MAGIC,
);

export class SuperBlobCoreTest extends SuperBlobCore {
	declare public readonly ['constructor']: Omit<
		typeof SuperBlobCoreTest,
		'new'
	>;

	static {
		constant(this, 'typeMagic');
	}
}

Deno.test('BYTE_LENGTH', () => {
	assertEquals(SuperBlobCoreTest.BYTE_LENGTH, 12);
});

Deno.test('type', () => {
	const maker = new SuperBlobCoreTest.Maker();
	const data = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]);
	const blob = BlobWrapper.alloc(data);
	maker.add(0x01020304, blob);
	maker.add(0x10203040, blob);
	const sb = maker.make();
	assertEquals(sb.type(0), 0x01020304);
	assertEquals(sb.type(1), 0x10203040);
});

Deno.test('blob', () => {
	const maker = new SuperBlobCoreTest.Maker();
	const data1 = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]);
	const data2 = new Uint8Array([2, 3, 4, 5, 6, 7, 8, 9]);
	const blob1 = BlobWrapper.alloc(data1);
	const blob2 = BlobWrapper.alloc(data2);
	maker.add(1, blob1);
	maker.add(2, blob2);
	const sb = maker.make();
	const get1 = sb.blob(0)!;
	const get2 = sb.blob(1)!;

	assertEquals(
		new Uint8Array(get1.buffer, get1.byteOffset, get1.length()),
		new Uint8Array(blob1.buffer, 0, 16),
	);

	// No offset means null. What would create this?
	new DataView(sb.buffer).setUint32(16, 0);
	assertEquals(sb.blob(0), null);

	assertEquals(
		new Uint8Array(get2.buffer, get2.byteOffset, get2.length()),
		new Uint8Array(blob2.buffer, 0, 16),
	);
});

Deno.test('find', () => {
	const maker = new SuperBlobCoreTest.Maker();
	const data1 = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]);
	const data2 = new Uint8Array([2, 3, 4, 5, 6, 7, 8, 9]);
	const blob1 = BlobWrapper.alloc(data1);
	const blob2 = BlobWrapper.alloc(data2);
	maker.add(1, blob1);
	maker.add(2, blob2);
	const sb = maker.make();
	const get1 = sb.find(1)!;
	const get2 = sb.find(2)!;
	const get3 = sb.find(3)!;
	assertEquals(
		new Uint8Array(get1.buffer, get1.byteOffset, get1.length()),
		new Uint8Array(blob1.buffer, 0, 16),
	);
	assertEquals(
		new Uint8Array(get2.buffer, get2.byteOffset, get2.length()),
		new Uint8Array(blob2.buffer, 0, 16),
	);
	assertEquals(get3, null);
});

Deno.test('count', () => {
	const maker = new SuperBlobCoreTest.Maker();
	const data1 = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]);
	const data2 = new Uint8Array([2, 3, 4, 5, 6, 7, 8, 9]);
	const blob1 = BlobWrapper.alloc(data1);
	const blob2 = BlobWrapper.alloc(data2);
	maker.add(1, blob1);
	maker.add(2, blob1);
	maker.add(2, blob2);
	const sb = maker.make();
	assertEquals(sb.count(), 2);
});

Deno.test('add BlobCore', () => {
	const maker = new SuperBlobCoreTest.Maker();
	const data = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]);
	const blob = BlobWrapper.alloc(data);
	maker.add(0x01020304, blob);
	const sb = maker.make();
	assertEquals(new Uint8Array(sb.buffer, 20), new Uint8Array(blob.buffer));
});

Deno.test('add SuperBlob', () => {
	const maker1 = new SuperBlobCoreTest.Maker();
	const data = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]);
	maker1.add(0x11111111, BlobWrapper.alloc(data));
	maker1.add(0x22222222, BlobWrapper.alloc(data));
	const maker2 = new SuperBlobCoreTest.Maker();
	maker2.add(maker1.make());
	const sb2 = maker2.make();
	assertEquals(sb2.count(), 2);
	assertEquals(sb2.type(0), 0x11111111);
	assertEquals(sb2.type(1), 0x22222222);
	sb2.blob(0)!.at(Uint8Ptr, 8)[0] = 11;
	sb2.blob(1)!.at(Uint8Ptr, 8)[0] = 12;
	assertEquals(maker1.make().blob(0)!.at(Uint8Ptr, 8)[0], 1);
	assertEquals(maker1.make().blob(1)!.at(Uint8Ptr, 8)[0], 1);
});

Deno.test('add SuperBlobMaker', () => {
	const maker1 = new SuperBlobCoreTest.Maker();
	const data = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]);
	maker1.add(0x11111111, BlobWrapper.alloc(data));
	maker1.add(0x22222222, BlobWrapper.alloc(data));
	const maker2 = new SuperBlobCoreTest.Maker();
	maker2.add(maker1);
	const sb2 = maker2.make();
	assertEquals(sb2.count(), 2);
	assertEquals(sb2.type(0), 0x11111111);
	assertEquals(sb2.type(1), 0x22222222);
	sb2.blob(0)!.at(Uint8Ptr, 8)[0] = 11;
	sb2.blob(1)!.at(Uint8Ptr, 8)[0] = 12;
	assertEquals(maker1.make().blob(0)!.at(Uint8Ptr, 8)[0], 1);
	assertEquals(maker1.make().blob(1)!.at(Uint8Ptr, 8)[0], 1);
});

Deno.test('contains', () => {
	const maker = new SuperBlobCoreTest.Maker();
	const data = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]);
	const blob = BlobWrapper.alloc(data);
	assertEquals(maker.contains(0x01020304), false);
	maker.add(0x01020304, blob);
	assertEquals(maker.contains(0x01020304), true);
});

Deno.test('get', () => {
	const maker = new SuperBlobCoreTest.Maker();
	const data = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]);
	const blob = BlobWrapper.alloc(data);
	assertEquals(maker.get(0x01020304), null);
	maker.add(0x01020304, blob);
	assert(maker.get(0x01020304));
});

Deno.test('size', () => {
	const maker = new SuperBlobCoreTest.Maker();
	assertEquals(maker.size(), 12);
	assertEquals(maker.make().length(), maker.size());
	const data = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]);
	const blob = BlobWrapper.alloc(data);
	maker.add(1, blob);
	assertEquals(maker.size(), 36);
	assertEquals(maker.make().length(), maker.size());
	maker.add(1, blob);
	assertEquals(maker.size(), 36);
	assertEquals(maker.make().length(), maker.size());
	maker.add(2, blob);
	assertEquals(maker.size(), 60);
	assertEquals(maker.make().length(), maker.size());
	assertEquals(maker.size([4, 8]), 88);
	assertEquals(maker.make().length(), maker.size());
	assertEquals(maker.size([4, 8], 4, 8), 116);
	assertEquals(maker.make().length(), maker.size());
});
