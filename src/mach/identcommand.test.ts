import {describe, it} from 'node:test';
import {strictEqual} from 'node:assert';

import {IdentCommand} from './identcommand.ts';

void describe('IdentCommand', () => {
	void it('BYTE_LENGTH', () => {
		strictEqual(IdentCommand.BYTE_LENGTH, 8);
	});
});
