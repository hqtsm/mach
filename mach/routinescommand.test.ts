import { assertEquals } from '@std/assert';

import { RoutinesCommand } from './routinescommand.ts';

Deno.test('BYTE_LENGTH', () => {
	assertEquals(RoutinesCommand.BYTE_LENGTH, 40);
});
