import {describe, it} from 'node:test';
import {strictEqual} from 'node:assert';

import {DylinkerCommand} from './dylinkercommand.ts';

void describe('DylinkerCommand', () => {
	void it('BYTE_LENGTH', () => {
		strictEqual(DylinkerCommand.BYTE_LENGTH, 12);
	});
});
