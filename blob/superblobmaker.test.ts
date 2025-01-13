import { assert, assertEquals } from '@std/assert';
import { Uint8Ptr } from '@hqtsm/struct';
import { BlobWrapper } from './blobwrapper.ts';
import { SuperBlobMaker } from './superblobmaker.ts';

Deno.test('add BlobCore', () => {
	const maker = new SuperBlobMaker();
	const data = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]);
	const blob = BlobWrapper.alloc(data);
	maker.add(0x01020304, blob);
	const sb = maker.make();
	assertEquals(new Uint8Array(sb.buffer, 20), new Uint8Array(blob.buffer));
});

Deno.test('add SuperBlob', () => {
	const maker1 = new SuperBlobMaker();
	const data = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]);
	maker1.add(0x11111111, BlobWrapper.alloc(data));
	maker1.add(0x22222222, BlobWrapper.alloc(data));
	const maker2 = new SuperBlobMaker();
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
	const maker1 = new SuperBlobMaker();
	const data = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]);
	maker1.add(0x11111111, BlobWrapper.alloc(data));
	maker1.add(0x22222222, BlobWrapper.alloc(data));
	const maker2 = new SuperBlobMaker();
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
	const maker = new SuperBlobMaker();
	const data = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]);
	const blob = BlobWrapper.alloc(data);
	assertEquals(maker.contains(0x01020304), false);
	maker.add(0x01020304, blob);
	assertEquals(maker.contains(0x01020304), true);
});

Deno.test('get', () => {
	const maker = new SuperBlobMaker();
	const data = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]);
	const blob = BlobWrapper.alloc(data);
	assertEquals(maker.get(0x01020304), null);
	maker.add(0x01020304, blob);
	assert(maker.get(0x01020304));
});

Deno.test('size', () => {
	const maker = new SuperBlobMaker();
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
