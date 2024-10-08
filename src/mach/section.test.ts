import {describe, it} from 'node:test';
import {strictEqual} from 'node:assert';

import {Section} from './section.ts';

void describe('Section', () => {
	void it('sizeof', () => {
		strictEqual(Section.sizeof, 68);
	});
});
