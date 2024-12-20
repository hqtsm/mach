import { assertEquals } from '@std/assert';
import { DysymtabCommand } from './dysymtabcommand.ts';

Deno.test('BYTE_LENGTH', () => {
	assertEquals(DysymtabCommand.BYTE_LENGTH, 80);
});
