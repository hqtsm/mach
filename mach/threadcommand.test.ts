import { assertEquals } from '@std/assert';
import { ThreadCommand } from './threadcommand.ts';

Deno.test('BYTE_LENGTH', () => {
	assertEquals(ThreadCommand.BYTE_LENGTH, 8);
});
