import {describe, it} from 'node:test';
import {strictEqual} from 'node:assert';

import {DylibModule64} from './dylibmodule64.ts';

void describe('DylibModule64', () => {
	void it('BYTE_LENGTH', () => {
		strictEqual(DylibModule64.BYTE_LENGTH, 56);
	});
});
