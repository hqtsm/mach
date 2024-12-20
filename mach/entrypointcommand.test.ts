import { assertEquals } from '@std/assert';
import { EntryPointCommand } from './entrypointcommand.ts';

Deno.test('BYTE_LENGTH', () => {
	assertEquals(EntryPointCommand.BYTE_LENGTH, 24);
});
