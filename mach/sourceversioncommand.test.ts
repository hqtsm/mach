import { assertEquals } from '@std/assert';

import { SourceVersionCommand } from './sourceversioncommand.ts';

Deno.test('BYTE_LENGTH', () => {
	assertEquals(SourceVersionCommand.BYTE_LENGTH, 16);
});
