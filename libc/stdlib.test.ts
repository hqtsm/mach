import { assertEquals, assertInstanceOf, assertThrows } from '@std/assert';
import { testOOM } from '../spec/memory.ts';
import { ENOMEM } from './errno.ts';
import { calloc, malloc } from './stdlib.ts';

Deno.test('malloc', () => {
	assertEquals(malloc(Infinity), null);
	{
		const ptr = malloc(0);
		assertInstanceOf(ptr, ArrayBuffer);
		assertEquals(ptr.byteLength, 0);
	}
	{
		const ptr = malloc(1);
		assertInstanceOf(ptr, ArrayBuffer);
		assertEquals(ptr.byteLength, 1);
	}
	{
		const ptr = malloc(42);
		assertInstanceOf(ptr, ArrayBuffer);
		assertEquals(ptr.byteLength, 42);
	}

	testOOM([42], () => {
		assertEquals(malloc(42), null);
		const context = { errno: 0 };
		assertEquals(malloc(42, context), null);
		assertEquals(context.errno, ENOMEM);
	});

	testOOM(
		[42],
		() => {
			assertThrows(() => malloc(42), Error, 'OTHER-ERROR');
		},
		Error,
		'OTHER-ERROR',
	);
});

Deno.test('calloc', () => {
	assertEquals(calloc(Infinity), null);
	{
		const ptr = calloc(0);
		assertInstanceOf(ptr, ArrayBuffer);
		assertEquals(ptr.byteLength, 0);
	}
	{
		const ptr = calloc(1);
		assertInstanceOf(ptr, ArrayBuffer);
		assertEquals(ptr.byteLength, 1);
	}
	{
		const ptr = calloc(42);
		assertInstanceOf(ptr, ArrayBuffer);
		assertEquals(ptr.byteLength, 42);
	}

	testOOM([42], () => {
		assertEquals(calloc(42), null);
		const context = { errno: 0 };
		assertEquals(calloc(42, context), null);
		assertEquals(context.errno, ENOMEM);
	});

	testOOM(
		[42],
		() => {
			assertThrows(() => calloc(42), Error, 'OTHER-ERROR');
		},
		Error,
		'OTHER-ERROR',
	);
});
