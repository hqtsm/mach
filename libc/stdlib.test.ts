import {
	assertEquals,
	assertInstanceOf,
	assertStrictEquals,
	assertThrows,
} from '@std/assert';
import { testOOM } from '../spec/memory.ts';
import { ENOMEM } from './errno.ts';
import { calloc, malloc, memset, realloc } from './stdlib.ts';

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
	assertEquals(calloc(1, Infinity), null);
	{
		const ptr = calloc(1, 0);
		assertInstanceOf(ptr, ArrayBuffer);
		assertEquals(ptr.byteLength, 0);
	}
	{
		const ptr = calloc(1, 1);
		assertInstanceOf(ptr, ArrayBuffer);
		assertEquals(ptr.byteLength, 1);
	}
	{
		const ptr = calloc(21, 2);
		assertInstanceOf(ptr, ArrayBuffer);
		assertEquals(ptr.byteLength, 42);
	}

	testOOM([42], () => {
		assertEquals(calloc(1, 42), null);
		const context = { errno: 0 };
		assertEquals(calloc(1, 42, context), null);
		assertEquals(context.errno, ENOMEM);
	});

	testOOM(
		[42],
		() => {
			assertThrows(() => calloc(1, 42), Error, 'OTHER-ERROR');
		},
		Error,
		'OTHER-ERROR',
	);
});

Deno.test('realloc', () => {
	const src = new ArrayBuffer(10);
	for (let i = 0, b = new Uint8Array(src); i < 10; i++) {
		b[i] = i;
	}

	assertEquals(realloc(src, Infinity), null);
	{
		const ptr = realloc(src, 0);
		assertInstanceOf(ptr, ArrayBuffer);
		assertEquals(ptr.byteLength, 0);
	}
	{
		const ptr = realloc(null, 10);
		assertInstanceOf(ptr, ArrayBuffer);
		assertEquals(ptr.byteLength, 10);
	}
	{
		const ptr = realloc(src, 5);
		assertInstanceOf(ptr, ArrayBuffer);
		assertEquals(ptr.byteLength, 5);
		assertEquals(new Uint8Array(ptr), new Uint8Array([0, 1, 2, 3, 4]));
	}
	{
		const ptr = realloc(src, 15);
		assertInstanceOf(ptr, ArrayBuffer);
		assertEquals(ptr.byteLength, 15);
		assertEquals(
			new Uint8Array(ptr),
			new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 0, 0, 0, 0]),
		);
	}
	{
		const ptr = realloc(src, 10);
		assertStrictEquals(ptr, src);
	}

	testOOM([42], () => {
		assertEquals(realloc(src, 42), null);
		const context = { errno: 0 };
		assertEquals(realloc(src, 42, context), null);
		assertEquals(context.errno, ENOMEM);
	});

	testOOM(
		[42],
		() => {
			assertThrows(() => realloc(src, 42), Error, 'OTHER-ERROR');
		},
		Error,
		'OTHER-ERROR',
	);
});

Deno.test('memset', () => {
	{
		const ab = new ArrayBuffer(10);
		memset(ab, 1, 10);
		memset(ab, 2, 5);
		assertEquals(
			new Uint8Array(ab),
			new Uint8Array([2, 2, 2, 2, 2, 1, 1, 1, 1, 1]),
		);
	}
	{
		const sab = new SharedArrayBuffer(10);
		memset(sab, 1, 10);
		memset(sab, 2, 5);
		assertEquals(
			new Uint8Array<ArrayBufferLike>(sab),
			new Uint8Array([2, 2, 2, 2, 2, 1, 1, 1, 1, 1]),
		);
	}
	{
		const arr = new Uint8Array(10);
		memset(arr, 1, 10);
		memset(arr, 2, 5);
		assertEquals(
			arr,
			new Uint8Array([2, 2, 2, 2, 2, 1, 1, 1, 1, 1]),
		);
	}
});
