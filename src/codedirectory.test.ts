import {describe, it} from 'node:test';
import {strictEqual} from 'node:assert';

import {CodeDirectory} from './codedirectory.ts';

void describe('codedirectory', () => {
	void it('sizeof', () => {
		strictEqual(CodeDirectory.sizeof, 96);
	});
});
