import { assertEquals } from '@std/assert';

import { LinkerOptionCommand } from './linkeroptioncommand.ts';

Deno.test('BYTE_LENGTH', () => {
	assertEquals(LinkerOptionCommand.BYTE_LENGTH, 12);
});
