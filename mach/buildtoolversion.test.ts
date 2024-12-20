import { assertEquals } from '@std/assert';
import { BuildToolVersion } from './buildtoolversion.ts';

Deno.test('BYTE_LENGTH', () => {
	assertEquals(BuildToolVersion.BYTE_LENGTH, 8);
});
