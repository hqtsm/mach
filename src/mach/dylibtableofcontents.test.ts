import {describe, it} from 'node:test';
import {strictEqual} from 'node:assert';

import {DylibTableOfContents} from './dylibtableofcontents.ts';

void describe('DylibTableOfContents', () => {
	void it('BYTE_LENGTH', () => {
		strictEqual(DylibTableOfContents.BYTE_LENGTH, 8);
	});
});
