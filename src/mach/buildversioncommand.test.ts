import {describe, it} from 'node:test';
import {strictEqual} from 'node:assert';

import {BuildVersionCommand} from './buildversioncommand.ts';

void describe('BuildVersionCommand', () => {
	void it('BYTE_LENGTH', () => {
		strictEqual(BuildVersionCommand.BYTE_LENGTH, 24);
	});
});
