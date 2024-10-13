import {describe, it} from 'node:test';
import {strictEqual} from 'node:assert';

import {TwolevelHint} from './twolevelhint.ts';

void describe('TwolevelHint', () => {
	void it('BYTE_LENGTH', () => {
		strictEqual(TwolevelHint.BYTE_LENGTH, 4);
	});
});
