import { assertEquals } from '@std/assert';
import { strlen, strncmp } from './string.ts';

function cstr(s: string): Uint8Array {
	return new TextEncoder().encode(`${s}\0`);
}

Deno.test('strlen', () => {
	assertEquals(strlen(cstr('')), 0);
	assertEquals(strlen(cstr('a')), 1);
	assertEquals(strlen(cstr('a').buffer), 1);
	assertEquals(strlen(cstr('ab')), 2);
	assertEquals(strlen(new Uint8Array([1, 2, 3, 0, 1, 2, 3, 0])), 3);
});

Deno.test('strncmp', () => {
	assertEquals(strncmp(cstr('a'), cstr('a').buffer, 1), 0);
	assertEquals(strncmp(cstr('A').buffer, cstr('A'), 2), 0);
	assertEquals(strncmp(cstr('a'), cstr('b'), 1), -1);
	assertEquals(strncmp(cstr('b'), cstr('a'), 1), 1);
	assertEquals(strncmp(cstr('a'), cstr('c'), 1), -2);
	assertEquals(strncmp(cstr('c'), cstr('a'), 1), 2);
	assertEquals(strncmp(cstr('AB'), cstr('AC'), 1), 0);
	assertEquals(strncmp(cstr(''), cstr(''), 0), 0);
	assertEquals(strncmp(cstr(''), cstr(''), 1), 0);
	assertEquals(strncmp(cstr(''), cstr(''), 2), 0);
	assertEquals(strncmp(cstr('A'), cstr('B'), 0), 0);
	assertEquals(strncmp(cstr('A'), cstr('B'), -1), 0);
});
