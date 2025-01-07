import { assert, assertEquals } from '@std/assert';
import { SuperBlobMaker } from './superblobmaker.ts';
import { BlobWrapper } from './blobwrapper.ts';

Deno.test('add', () => {
	const maker = new SuperBlobMaker();
	const data = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]);
	const blob = BlobWrapper.alloc(data);
	maker.add(0x01020304, blob);
	const sb = maker.make();
	assertEquals(new Uint8Array(sb.buffer, 20), new Uint8Array(blob.buffer));
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
});
