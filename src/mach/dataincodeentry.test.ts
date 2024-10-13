import {describe, it} from 'node:test';
import {strictEqual} from 'node:assert';

import {DataInCodeEntry} from './dataincodeentry.ts';

void describe('DataInCodeEntry', () => {
	void it('BYTE_LENGTH', () => {
		strictEqual(DataInCodeEntry.BYTE_LENGTH, 8);
	});
});
