import { assertEquals } from '@std/assert';
import { LoadCommand } from './loadcommand.ts';

Deno.test('BYTE_LENGTH', () => {
	assertEquals(LoadCommand.BYTE_LENGTH, 8);
});
