import {describe, it} from 'node:test';
import {strictEqual} from 'node:assert';

import {RpathCommand} from './rpathcommand.ts';

void describe('RpathCommand', () => {
	void it('BYTE_LENGTH', () => {
		strictEqual(RpathCommand.BYTE_LENGTH, 12);
	});
});
