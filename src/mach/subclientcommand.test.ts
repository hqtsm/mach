import {describe, it} from 'node:test';
import {strictEqual} from 'node:assert';

import {SubClientCommand} from './subclientcommand.ts';

void describe('SubClientCommand', () => {
	void it('BYTE_LENGTH', () => {
		strictEqual(SubClientCommand.BYTE_LENGTH, 12);
	});
});
