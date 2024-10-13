import {describe, it} from 'node:test';
import {strictEqual} from 'node:assert';

import {EncryptionInfoCommand} from './encryptioninfocommand.ts';

void describe('EncryptionInfoCommand', () => {
	void it('BYTE_LENGTH', () => {
		strictEqual(EncryptionInfoCommand.BYTE_LENGTH, 20);
	});
});
