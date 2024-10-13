import {describe, it} from 'node:test';
import {strictEqual} from 'node:assert';

import {FilesetEntryCommand} from './filesetentrycommand.ts';

void describe('FilesetEntryCommand', () => {
	void it('BYTE_LENGTH', () => {
		strictEqual(FilesetEntryCommand.BYTE_LENGTH, 32);
	});
});
