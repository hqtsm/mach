import { assertEquals } from '@std/assert';
import { Section64 } from './section64.ts';

Deno.test('BYTE_LENGTH', () => {
	assertEquals(Section64.BYTE_LENGTH, 80);
});
