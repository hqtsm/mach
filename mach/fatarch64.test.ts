import { assertEquals } from '@std/assert';

import { FatArch64 } from './fatarch64.ts';

Deno.test('BYTE_LENGTH', () => {
	assertEquals(FatArch64.BYTE_LENGTH, 32);
});
