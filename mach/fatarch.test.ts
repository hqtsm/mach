import { assertEquals } from '@std/assert';
import { FatArch } from './fatarch.ts';

Deno.test('BYTE_LENGTH', () => {
	assertEquals(FatArch.BYTE_LENGTH, 20);
});
