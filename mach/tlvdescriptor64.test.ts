import { assertEquals } from '@std/assert';
import { TlvDescriptor64 } from './tlvdescriptor64.ts';

Deno.test('BYTE_LENGTH', () => {
	assertEquals(TlvDescriptor64.BYTE_LENGTH, 24);
});
