import { assertEquals } from '@std/assert';
import { Section } from './section.ts';

Deno.test('BYTE_LENGTH', () => {
	assertEquals(Section.BYTE_LENGTH, 68);
});
