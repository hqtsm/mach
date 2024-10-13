import {describe, it} from 'node:test';
import {strictEqual} from 'node:assert';

import {PrebindCksumCommand} from './prebindcksumcommand.ts';

void describe('PrebindCksumCommand', () => {
	void it('BYTE_LENGTH', () => {
		strictEqual(PrebindCksumCommand.BYTE_LENGTH, 12);
	});
});
