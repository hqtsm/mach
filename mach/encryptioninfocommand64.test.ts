import { assertEquals } from '@std/assert';

import { EncryptionInfoCommand64 } from './encryptioninfocommand64.ts';

Deno.test('BYTE_LENGTH', () => {
	assertEquals(EncryptionInfoCommand64.BYTE_LENGTH, 24);
});
