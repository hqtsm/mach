import {describe, it} from 'node:test';
import {strictEqual} from 'node:assert';

import {EntryPointCommand} from './entrypointcommand.ts';

void describe('EntryPointCommand', () => {
	void it('BYTE_LENGTH', () => {
		strictEqual(EntryPointCommand.BYTE_LENGTH, 24);
	});
});
