import { assertEquals } from '@std/assert';

import { DylibCommand } from './dylibcommand.ts';

Deno.test('BYTE_LENGTH', () => {
	assertEquals(DylibCommand.BYTE_LENGTH, 24);
});
