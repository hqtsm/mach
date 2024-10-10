import {describe, it} from 'node:test';
import {strictEqual} from 'node:assert';

import {Fvmlib} from './fvmlib.ts';

void describe('Fvmlib', () => {
	void it('BYTE_LENGTH', () => {
		strictEqual(Fvmlib.BYTE_LENGTH, 12);
	});
});
