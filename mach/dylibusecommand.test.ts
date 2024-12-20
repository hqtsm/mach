import { assertEquals } from '@std/assert';
import { DylibUseCommand } from './dylibusecommand.ts';

Deno.test('BYTE_LENGTH', () => {
	assertEquals(DylibUseCommand.BYTE_LENGTH, 28);
});
