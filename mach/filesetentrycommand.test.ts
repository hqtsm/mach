import { assertEquals } from '@std/assert';
import { FilesetEntryCommand } from './filesetentrycommand.ts';

Deno.test('BYTE_LENGTH', () => {
	assertEquals(FilesetEntryCommand.BYTE_LENGTH, 32);
});
