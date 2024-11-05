import { assertEquals } from '@std/assert';

import { Fvmlib } from './fvmlib.ts';

Deno.test('BYTE_LENGTH', () => {
	assertEquals(Fvmlib.BYTE_LENGTH, 12);
});
