import { assertEquals } from '@std/assert';
import { TargetTripleCommand } from './targettriplecommand.ts';

Deno.test('BYTE_LENGTH', () => {
	assertEquals(TargetTripleCommand.BYTE_LENGTH, 12);
});
