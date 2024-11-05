import { assertEquals } from '@std/assert';

import { DylinkerCommand } from './dylinkercommand.ts';

Deno.test('BYTE_LENGTH', () => {
	assertEquals(DylinkerCommand.BYTE_LENGTH, 12);
});
