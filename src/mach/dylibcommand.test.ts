import {describe, it} from 'node:test';
import {strictEqual} from 'node:assert';

import {DylibCommand} from './dylibcommand.ts';

void describe('DylibCommand', () => {
	void it('BYTE_LENGTH', () => {
		strictEqual(DylibCommand.BYTE_LENGTH, 24);
	});
});
