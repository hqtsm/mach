import { assertEquals } from '@std/assert';

import { TlvDescriptor } from './tlvdescriptor.ts';

Deno.test('BYTE_LENGTH', () => {
	assertEquals(TlvDescriptor.BYTE_LENGTH, 12);
});
