import {describe, it} from 'node:test';
import {strictEqual} from 'node:assert';

import {Section} from './section.ts';

void describe('Section', () => {
	void it('BYTE_LENGTH', () => {
		strictEqual(Section.BYTE_LENGTH, 68);
	});
});
