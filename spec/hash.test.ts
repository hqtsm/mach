import { assertEquals } from '@std/assert';
import { BadReader } from './hash.ts';

Deno.test('BadReader', async () => {
	const bad = new BadReader(10, 'application/test');
	assertEquals(bad.type, 'application/test');

	bad.diff = 1;
	assertEquals(bad.diff, 1);
	assertEquals(bad.size, 10);
	assertEquals((await bad.arrayBuffer()).byteLength, 9);

	bad.diff = 2;
	assertEquals(bad.diff, 2);
	assertEquals(bad.size, 10);
	assertEquals((await bad.arrayBuffer()).byteLength, 8);

	bad.diff = -1;
	assertEquals(bad.diff, -1);
	assertEquals(bad.size, 10);
	assertEquals((await bad.arrayBuffer()).byteLength, 11);

	bad.diff = -2;
	assertEquals(bad.diff, -2);
	assertEquals(bad.size, 10);
	assertEquals((await bad.arrayBuffer()).byteLength, 12);
});
