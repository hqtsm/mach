import { assertEquals } from '@std/assert';
import { MachHeader } from './machheader.ts';

Deno.test('BYTE_LENGTH', () => {
	assertEquals(MachHeader.BYTE_LENGTH, 28);
});
