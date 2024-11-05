import { assertEquals } from '@std/assert';

import { TwolevelHintsCommand } from './twolevelhintscommand.ts';

Deno.test('BYTE_LENGTH', () => {
	assertEquals(TwolevelHintsCommand.BYTE_LENGTH, 16);
});
