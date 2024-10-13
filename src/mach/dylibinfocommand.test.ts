import {describe, it} from 'node:test';
import {strictEqual} from 'node:assert';

import {DylibInfoCommand} from './dylibinfocommand.ts';

void describe('DylibInfoCommand', () => {
	void it('BYTE_LENGTH', () => {
		strictEqual(DylibInfoCommand.BYTE_LENGTH, 48);
	});
});
