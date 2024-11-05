import { assertEquals } from '@std/assert';

import { Blob } from './blob.ts';

Deno.test('BYTE_LENGTH', () => {
	assertEquals(Blob.BYTE_LENGTH, 8);
});
