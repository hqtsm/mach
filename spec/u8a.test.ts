import { assertEquals } from '@std/assert';
import { indexOf } from './u8a.ts';

Deno.test('indexOf', () => {
	assertEquals(indexOf(new Uint8Array(1), new Uint8Array(1)), 0);
	assertEquals(indexOf(new Uint8Array(0), new Uint8Array(0)), -1);
});
