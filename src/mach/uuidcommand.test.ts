import {describe, it} from 'node:test';
import {strictEqual} from 'node:assert';

import {UuidCommand} from './uuidcommand.ts';

void describe('UuidCommand', () => {
	void it('BYTE_LENGTH', () => {
		strictEqual(UuidCommand.BYTE_LENGTH, 24);
	});
});
