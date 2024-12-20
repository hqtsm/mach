import { assertEquals } from '@std/assert';
import { SubClientCommand } from './subclientcommand.ts';

Deno.test('BYTE_LENGTH', () => {
	assertEquals(SubClientCommand.BYTE_LENGTH, 12);
});
