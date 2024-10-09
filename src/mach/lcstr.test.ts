import {describe, it} from 'node:test';
import {strictEqual} from 'node:assert';

import {LcStr} from './lcstr.ts';

void describe('LcStr', () => {
	void it('BYTE_LENGTH', () => {
		strictEqual(LcStr.BYTE_LENGTH, 4);
	});
});
