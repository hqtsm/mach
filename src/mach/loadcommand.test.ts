import {describe, it} from 'node:test';
import {strictEqual} from 'node:assert';

import {LoadCommand} from './loadcommand.ts';

void describe('LoadCommand', () => {
	void it('BYTE_LENGTH', () => {
		strictEqual(LoadCommand.BYTE_LENGTH, 8);
	});
});
