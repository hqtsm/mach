import { assertEquals } from '@std/assert';
import { SuperBlob } from './superblob.ts';
import { SuperBlobMaker } from './superblobmaker.ts';
import { BlobWrapper } from './blobwrapper.ts';

Deno.test('BYTE_LENGTH', () => {
	assertEquals(SuperBlob.BYTE_LENGTH, 12);
});

Deno.test('type', () => {
	const maker = new SuperBlobMaker();
	const data = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]);
	const blob = BlobWrapper.alloc(data);
	maker.add(0x01020304, blob);
	maker.add(0x10203040, blob);
	const sb = maker.make();
	assertEquals(sb.type(0), 0x01020304);
	assertEquals(sb.type(1), 0x10203040);
});
