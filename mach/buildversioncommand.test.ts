import { assertEquals } from '@std/assert';
import { BuildVersionCommand } from './buildversioncommand.ts';

Deno.test('BYTE_LENGTH', () => {
	assertEquals(BuildVersionCommand.BYTE_LENGTH, 24);
});
