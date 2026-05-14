import { assert } from '@std/assert';
import type { Reader } from './reader.ts';

Deno.test('Reader subset of Blob', () => {
	const reader: Reader = new Blob([]);
	assert(reader);
});
