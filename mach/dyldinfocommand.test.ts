import { assertEquals } from '@std/assert';
import { DyldInfoCommand } from './dyldinfocommand.ts';

Deno.test('BYTE_LENGTH', () => {
	assertEquals(DyldInfoCommand.BYTE_LENGTH, 48);
});
