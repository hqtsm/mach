import { assertEquals } from '@std/assert';
import { NoteCommand } from './notecommand.ts';

Deno.test('BYTE_LENGTH', () => {
	assertEquals(NoteCommand.BYTE_LENGTH, 40);
});
