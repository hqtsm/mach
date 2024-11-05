import { assertEquals } from '@std/assert';

import { EncryptionInfoCommand } from './encryptioninfocommand.ts';

Deno.test('BYTE_LENGTH', () => {
	assertEquals(EncryptionInfoCommand.BYTE_LENGTH, 20);
});
