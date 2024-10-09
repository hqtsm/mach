import {describe, it} from 'node:test';
import {strictEqual} from 'node:assert';

import {Blob} from './blob.ts';

void describe('Blob', () => {
	void it('BYTE_LENGTH', () => {
		strictEqual(Blob.BYTE_LENGTH, 8);
	});
});
