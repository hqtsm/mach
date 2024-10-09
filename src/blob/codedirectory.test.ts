import {describe, it} from 'node:test';
import {strictEqual} from 'node:assert';

import {CodeDirectory} from './codedirectory.ts';

void describe('CodeDirectory', () => {
	void it('BYTE_LENGTH', () => {
		strictEqual(CodeDirectory.BYTE_LENGTH, 96);
	});
});
