import { assertEquals } from '@std/assert';
import { RpathCommand } from './rpathcommand.ts';

Deno.test('BYTE_LENGTH', () => {
	assertEquals(RpathCommand.BYTE_LENGTH, 12);
});
