import {describe, it} from 'node:test';
import {strictEqual} from 'node:assert';

import {FvmfileCommand} from './fvmfilecommand.ts';

void describe('FvmfileCommand', () => {
	void it('BYTE_LENGTH', () => {
		strictEqual(FvmfileCommand.BYTE_LENGTH, 16);
	});
});
