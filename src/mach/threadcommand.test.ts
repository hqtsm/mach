import {describe, it} from 'node:test';
import {strictEqual} from 'node:assert';

import {ThreadCommand} from './threadcommand.ts';

void describe('ThreadCommand', () => {
	void it('BYTE_LENGTH', () => {
		strictEqual(ThreadCommand.BYTE_LENGTH, 8);
	});
});
