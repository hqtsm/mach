import { assertEquals } from '@std/assert';
import { CodeDirectoryScatter } from './codedirectoryscatter.ts';

Deno.test('BYTE_LENGTH', () => {
	assertEquals(CodeDirectoryScatter.BYTE_LENGTH, 24);
});
