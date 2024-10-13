import {describe, it} from 'node:test';
import {strictEqual} from 'node:assert';

import {SourceVersionCommand} from './sourceversioncommand.ts';

void describe('SourceVersionCommand', () => {
	void it('BYTE_LENGTH', () => {
		strictEqual(SourceVersionCommand.BYTE_LENGTH, 16);
	});
});
