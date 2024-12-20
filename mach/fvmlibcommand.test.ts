import { assertEquals } from '@std/assert';
import { FvmlibCommand } from './fvmlibcommand.ts';

Deno.test('BYTE_LENGTH', () => {
	assertEquals(FvmlibCommand.BYTE_LENGTH, 20);
});
