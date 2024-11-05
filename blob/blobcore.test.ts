import { assertEquals } from '@std/assert';

import { BlobWrapper } from './blobwrapper.ts';

Deno.test('BYTE_LENGTH', () => {
	assertEquals(BlobWrapper.BYTE_LENGTH, 8);
});
