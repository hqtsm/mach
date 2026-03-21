import { assertEquals } from '@std/assert';
import { BadReader } from './hash.ts';

Deno.test('BadReader', () => {
	const bad = new BadReader(10, 'application/test');
	assertEquals(bad.type, 'application/test');

	bad.diff = 1;
	assertEquals(bad.diff, 1);
	assertEquals(bad.size, 10);

	bad.diff = 2;
	assertEquals(bad.diff, 2);
	assertEquals(bad.size, 10);

	bad.diff = -1;
	assertEquals(bad.diff, -1);
	assertEquals(bad.size, 10);

	bad.diff = -2;
	assertEquals(bad.diff, -2);
	assertEquals(bad.size, 10);
});
