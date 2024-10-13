import {describe, it} from 'node:test';
import {strictEqual} from 'node:assert';

import {SymsegCommand} from './symsegcommand.ts';

void describe('SymsegCommand', () => {
	void it('BYTE_LENGTH', () => {
		strictEqual(SymsegCommand.BYTE_LENGTH, 16);
	});
});
