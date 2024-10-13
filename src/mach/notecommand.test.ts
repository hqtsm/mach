import {describe, it} from 'node:test';
import {strictEqual} from 'node:assert';

import {NoteCommand} from './notecommand.ts';

void describe('NoteCommand', () => {
	void it('BYTE_LENGTH', () => {
		strictEqual(NoteCommand.BYTE_LENGTH, 40);
	});
});
