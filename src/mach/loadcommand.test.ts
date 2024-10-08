import {describe, it} from 'node:test';
import {strictEqual} from 'node:assert';

import {LoadCommand} from './loadcommand.ts';

void describe('LoadCommand', () => {
	void it('sizeof', () => {
		strictEqual(LoadCommand.sizeof, 8);
	});
});
