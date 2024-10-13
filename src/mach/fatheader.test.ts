import {describe, it} from 'node:test';
import {strictEqual} from 'node:assert';

import {FatHeader} from './fatheader.ts';

void describe('FatHeader', () => {
	void it('BYTE_LENGTH', () => {
		strictEqual(FatHeader.BYTE_LENGTH, 8);
	});
});
