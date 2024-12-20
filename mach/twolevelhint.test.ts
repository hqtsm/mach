import { assertEquals } from '@std/assert';
import { TwolevelHint } from './twolevelhint.ts';

Deno.test('BYTE_LENGTH', () => {
	assertEquals(TwolevelHint.BYTE_LENGTH, 4);
});
