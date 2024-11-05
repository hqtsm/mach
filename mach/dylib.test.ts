import { assertEquals } from '@std/assert';

import { Dylib } from './dylib.ts';

Deno.test('BYTE_LENGTH', () => {
	assertEquals(Dylib.BYTE_LENGTH, 16);
});
