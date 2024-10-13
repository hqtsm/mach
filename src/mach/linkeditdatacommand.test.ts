import {describe, it} from 'node:test';
import {strictEqual} from 'node:assert';

import {LinkeditDataCommand} from './linkeditdatacommand.ts';

void describe('LinkeditDataCommand', () => {
	void it('BYTE_LENGTH', () => {
		strictEqual(LinkeditDataCommand.BYTE_LENGTH, 16);
	});
});
