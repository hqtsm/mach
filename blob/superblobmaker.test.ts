import { assertEquals } from '@std/assert';
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
