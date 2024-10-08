import {describe, it} from 'node:test';
import {strictEqual} from 'node:assert';

import {Section64} from './section64.ts';

void describe('Section64', () => {
	void it('sizeof', () => {
		strictEqual(Section64.sizeof, 80);
	});
});
