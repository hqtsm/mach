import { assertEquals } from '@std/assert';

import { MachHeader64 } from './machheader64.ts';

Deno.test('BYTE_LENGTH', () => {
	assertEquals(MachHeader64.BYTE_LENGTH, 32);
});
