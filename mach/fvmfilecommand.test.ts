import { assertEquals } from '@std/assert';
import { FvmfileCommand } from './fvmfilecommand.ts';

Deno.test('BYTE_LENGTH', () => {
	assertEquals(FvmfileCommand.BYTE_LENGTH, 16);
});
