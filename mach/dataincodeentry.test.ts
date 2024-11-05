import { assertEquals } from '@std/assert';

import { DataInCodeEntry } from './dataincodeentry.ts';

Deno.test('BYTE_LENGTH', () => {
	assertEquals(DataInCodeEntry.BYTE_LENGTH, 8);
});
