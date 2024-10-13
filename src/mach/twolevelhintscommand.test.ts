import {describe, it} from 'node:test';
import {strictEqual} from 'node:assert';

import {TwolevelHintsCommand} from './twolevelhintscommand.ts';

void describe('TwolevelHintsCommand', () => {
	void it('BYTE_LENGTH', () => {
		strictEqual(TwolevelHintsCommand.BYTE_LENGTH, 16);
	});
});
