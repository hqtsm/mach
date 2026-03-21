import { assertEquals, assertInstanceOf } from '@std/assert';
import { PAGE_SIZE_ARM64 as PAGE_SIZE } from '../mach/vm_param.ts';
import { BadReader, toAsyncIterator, toIterator } from './hash.ts';

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

	const slice = bad.slice(1, 10);
	assertEquals(slice.size, 9);
	assertEquals(slice.diff, -2);

	assertEquals(bad.slice(10).size, 0);
});

Deno.test('toIterator', () => {
	const it = toIterator(new ArrayBuffer(PAGE_SIZE));
	{
		const { done, value } = it.next();
		assertEquals(done, false);
		assertInstanceOf(value, ArrayBuffer);
		assertEquals(value.byteLength, 0);
	}
	{
		const { done, value } = it.next();
		assertEquals(done, false);
		assertInstanceOf(value, ArrayBuffer);
		assertEquals(value.byteLength, PAGE_SIZE);
	}
	{
		const { done, value } = it.next();
		assertEquals(done, true);
		assertEquals(value, undefined);
	}
});

Deno.test('toAsyncIterator', async () => {
	const it = toAsyncIterator(new ArrayBuffer(PAGE_SIZE));
	{
		const { done, value } = await it.next();
		assertEquals(done, false);
		assertInstanceOf(value, ArrayBuffer);
		assertEquals(value.byteLength, 0);
	}
	{
		const { done, value } = await it.next();
		assertEquals(done, false);
		assertInstanceOf(value, ArrayBuffer);
		assertEquals(value.byteLength, PAGE_SIZE);
	}
	{
		const { done, value } = await it.next();
		assertEquals(done, true);
		assertEquals(value, undefined);
	}
});
