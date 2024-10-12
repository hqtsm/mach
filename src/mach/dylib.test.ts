import {describe, it} from 'node:test';
import {strictEqual} from 'node:assert';

import {Dylib} from './dylib.ts';

void describe('Dylib', () => {
	void it('BYTE_LENGTH', () => {
		strictEqual(Dylib.BYTE_LENGTH, 16);
	});
});
