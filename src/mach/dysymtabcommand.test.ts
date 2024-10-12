import {describe, it} from 'node:test';
import {strictEqual} from 'node:assert';

import {DysymtabCommand} from './dysymtabcommand.ts';

void describe('DysymtabCommand', () => {
	void it('BYTE_LENGTH', () => {
		strictEqual(DysymtabCommand.BYTE_LENGTH, 80);
	});
});
