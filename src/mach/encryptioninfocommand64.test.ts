import {describe, it} from 'node:test';
import {strictEqual} from 'node:assert';

import {EncryptionInfoCommand64} from './encryptioninfocommand64.ts';

void describe('EncryptionInfoCommand64', () => {
	void it('BYTE_LENGTH', () => {
		strictEqual(EncryptionInfoCommand64.BYTE_LENGTH, 24);
	});
});
