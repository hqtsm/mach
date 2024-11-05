import { assertEquals } from '@std/assert';

import { SuperBlob } from './superblob.ts';

Deno.test('BYTE_LENGTH', () => {
	assertEquals(SuperBlob.BYTE_LENGTH, 12);
});
