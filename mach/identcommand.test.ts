import { assertEquals } from '@std/assert';

import { IdentCommand } from './identcommand.ts';

Deno.test('BYTE_LENGTH', () => {
	assertEquals(IdentCommand.BYTE_LENGTH, 8);
});
