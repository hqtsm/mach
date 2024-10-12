import {describe, it} from 'node:test';
import {strictEqual} from 'node:assert';

import {SubFrameworkCommand} from './subframeworkcommand.ts';

void describe('SubFrameworkCommand', () => {
	void it('BYTE_LENGTH', () => {
		strictEqual(SubFrameworkCommand.BYTE_LENGTH, 12);
	});
});
