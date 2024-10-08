import {describe, it} from 'node:test';
import {strictEqual} from 'node:assert';

import {LcStr} from './lcstr.ts';

void describe('LcStr', () => {
	void it('sizeof', () => {
		strictEqual(LcStr.sizeof, 4);
	});
});
