import {describe, it} from 'node:test';
import {strictEqual} from 'node:assert';

import {SymtabCommand} from './symtabcommand.ts';

void describe('SymtabCommand', () => {
	void it('BYTE_LENGTH', () => {
		strictEqual(SymtabCommand.BYTE_LENGTH, 24);
	});
});
