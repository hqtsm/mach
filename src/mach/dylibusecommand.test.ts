import {describe, it} from 'node:test';
import {strictEqual} from 'node:assert';

import {DylibUseCommand} from './dylibusecommand.ts';

void describe('DylibUseCommand', () => {
	void it('BYTE_LENGTH', () => {
		strictEqual(DylibUseCommand.BYTE_LENGTH, 28);
	});
});
