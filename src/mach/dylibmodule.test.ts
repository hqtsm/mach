import {describe, it} from 'node:test';
import {strictEqual} from 'node:assert';

import {DylibModule} from './dylibmodule.ts';

void describe('DylibModule', () => {
	void it('BYTE_LENGTH', () => {
		strictEqual(DylibModule.BYTE_LENGTH, 52);
	});
});
