import { assertEquals } from '@std/assert';
import { PreboundDylibCommand } from './prebounddylibcommand.ts';

Deno.test('BYTE_LENGTH', () => {
	assertEquals(PreboundDylibCommand.BYTE_LENGTH, 20);
});
