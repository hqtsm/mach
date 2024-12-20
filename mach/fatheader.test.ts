import { assertEquals } from '@std/assert';
import { FatHeader } from './fatheader.ts';

Deno.test('BYTE_LENGTH', () => {
	assertEquals(FatHeader.BYTE_LENGTH, 8);
});
