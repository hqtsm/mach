import { assertEquals } from '@std/assert';
import { PrebindCksumCommand } from './prebindcksumcommand.ts';

Deno.test('BYTE_LENGTH', () => {
	assertEquals(PrebindCksumCommand.BYTE_LENGTH, 12);
});
