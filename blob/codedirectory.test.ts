import { assertEquals } from '@std/assert';

import { CodeDirectory } from './codedirectory.ts';

Deno.test('BYTE_LENGTH', () => {
	assertEquals(CodeDirectory.BYTE_LENGTH, 96);
});
