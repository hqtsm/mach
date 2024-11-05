import { assertEquals } from '@std/assert';

import { DylibModule64 } from './dylibmodule64.ts';

Deno.test('BYTE_LENGTH', () => {
	assertEquals(DylibModule64.BYTE_LENGTH, 56);
});
