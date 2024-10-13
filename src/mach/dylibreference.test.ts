import {describe, it} from 'node:test';
import {strictEqual} from 'node:assert';

import {DylibReference} from './dylibreference.ts';

void describe('DylibReference', () => {
	void it('BYTE_LENGTH', () => {
		strictEqual(DylibReference.BYTE_LENGTH, 4);
	});
});
