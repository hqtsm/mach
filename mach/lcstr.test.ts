import { assertEquals } from '@std/assert';

import { LcStr } from './lcstr.ts';

Deno.test('BYTE_LENGTH', () => {
	assertEquals(LcStr.BYTE_LENGTH, 4);
});
