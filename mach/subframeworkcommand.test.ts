import { assertEquals } from '@std/assert';
import { SubFrameworkCommand } from './subframeworkcommand.ts';

Deno.test('BYTE_LENGTH', () => {
	assertEquals(SubFrameworkCommand.BYTE_LENGTH, 12);
});
