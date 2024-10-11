import {describe, it} from 'node:test';
import {strictEqual} from 'node:assert';

import {FvmlibCommand} from './fvmlibcommand.ts';

void describe('FvmlibCommand', () => {
	void it('BYTE_LENGTH', () => {
		strictEqual(FvmlibCommand.BYTE_LENGTH, 20);
	});
});
