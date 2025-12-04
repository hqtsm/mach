import { assertEquals } from '@std/assert';
import { Context } from './context.ts';

Deno.test('errno', () => {
	const c = new Context();
	assertEquals(c.errno, 0);
	c.errno = 1;
	assertEquals(c.errno, 1);
});
