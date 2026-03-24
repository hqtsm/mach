import { assertEquals } from '@std/assert';
import { alignUp } from './memutils.ts';

Deno.test('alignUp unsigned', () => {
	assertEquals(alignUp(0), 0);
	assertEquals(alignUp(1), 4);
	assertEquals(alignUp(2), 4);
	assertEquals(alignUp(3), 4);
	assertEquals(alignUp(4), 4);
	assertEquals(alignUp(5), 8);
	assertEquals(alignUp(6), 8);
	assertEquals(alignUp(7), 8);
	assertEquals(alignUp(8), 8);
	assertEquals(alignUp(9), 12);
	assertEquals(alignUp(10), 12);
	assertEquals(alignUp(11), 12);
	assertEquals(alignUp(12), 12);
	assertEquals(alignUp(13), 16);
	assertEquals(alignUp(14), 16);
	assertEquals(alignUp(15), 16);
	assertEquals(alignUp(16), 16);
	assertEquals(alignUp(17), 20);
	assertEquals(alignUp(18), 20);
	assertEquals(alignUp(19), 20);
	assertEquals(alignUp(20), 20);
});
