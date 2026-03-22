import { assertEquals, assertInstanceOf, assertThrows } from '@std/assert';
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
	{
		const desc = Object.getOwnPropertyDescriptor(
			globalThis,
			'ArrayBuffer',
		)!;
		Object.defineProperty(globalThis, 'ArrayBuffer', {
			...desc,
			value: new Proxy(desc.value, {
				construct: () => {
					throw new RangeError('TEST-OOM');
				},
			}),
		});
		try {
			assertEquals(malloc(42), null);
			const context = { errno: 0 };
			assertEquals(malloc(42, context), null);
			assertEquals(context.errno, ENOMEM);
		} finally {
			Object.defineProperty(globalThis, 'ArrayBuffer', desc);
		}
	}
	{
		const desc = Object.getOwnPropertyDescriptor(
			globalThis,
			'ArrayBuffer',
		)!;
		Object.defineProperty(globalThis, 'ArrayBuffer', {
			...desc,
			value: new Proxy(desc.value, {
				construct: () => {
					throw new Error('Other Error');
				},
			}),
		});
		try {
			assertThrows(() => malloc(42), Error, 'Other Error');
		} finally {
			Object.defineProperty(globalThis, 'ArrayBuffer', desc);
		}
	}
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
	{
		const desc = Object.getOwnPropertyDescriptor(
			globalThis,
			'ArrayBuffer',
		)!;
		Object.defineProperty(globalThis, 'ArrayBuffer', {
			...desc,
			value: new Proxy(desc.value, {
				construct: () => {
					throw new RangeError('TEST-OOM');
				},
			}),
		});
		try {
			assertEquals(calloc(42), null);
			const context = { errno: 0 };
			assertEquals(calloc(42, context), null);
			assertEquals(context.errno, ENOMEM);
		} finally {
			Object.defineProperty(globalThis, 'ArrayBuffer', desc);
		}
	}
});
