import { assertEquals } from '@std/assert';
import { UuidCommand } from './uuidcommand.ts';

Deno.test('BYTE_LENGTH', () => {
	assertEquals(UuidCommand.BYTE_LENGTH, 24);
});
