import { assertEquals } from '@std/assert';
import { SuperBlobCoreIndex } from './superblobcoreindex.ts';

Deno.test('BYTE_LENGTH', () => {
	assertEquals(SuperBlobCoreIndex.BYTE_LENGTH, 8);
});
