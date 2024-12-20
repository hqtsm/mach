import { assertEquals } from '@std/assert';
import { LinkeditDataCommand } from './linkeditdatacommand.ts';

Deno.test('BYTE_LENGTH', () => {
	assertEquals(LinkeditDataCommand.BYTE_LENGTH, 16);
});
