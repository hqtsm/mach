import { assertEquals } from '@std/assert';

import { DylibReference } from './dylibreference.ts';

Deno.test('BYTE_LENGTH', () => {
	assertEquals(DylibReference.BYTE_LENGTH, 4);
});
