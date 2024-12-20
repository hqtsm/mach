import { assertEquals } from '@std/assert';
import { DylibInfoCommand } from './dylibinfocommand.ts';

Deno.test('BYTE_LENGTH', () => {
	assertEquals(DylibInfoCommand.BYTE_LENGTH, 48);
});
