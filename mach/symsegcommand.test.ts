import { assertEquals } from '@std/assert';

import { SymsegCommand } from './symsegcommand.ts';

Deno.test('BYTE_LENGTH', () => {
	assertEquals(SymsegCommand.BYTE_LENGTH, 16);
});
