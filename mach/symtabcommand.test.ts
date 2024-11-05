import { assertEquals } from '@std/assert';

import { SymtabCommand } from './symtabcommand.ts';

Deno.test('BYTE_LENGTH', () => {
	assertEquals(SymtabCommand.BYTE_LENGTH, 24);
});
