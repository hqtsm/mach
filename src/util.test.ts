import {describe, it} from 'node:test';
import {strictEqual} from 'node:assert';

import {alignUp} from './util.ts';

void describe('alignUp', () => {
	void it('positive', () => {
		strictEqual(alignUp(0, 4), 0);
		strictEqual(alignUp(1, 4), 4);
		strictEqual(alignUp(2, 4), 4);
		strictEqual(alignUp(3, 4), 4);
		strictEqual(alignUp(4, 4), 4);
		strictEqual(alignUp(5, 4), 8);
		strictEqual(alignUp(6, 4), 8);
		strictEqual(alignUp(7, 4), 8);
		strictEqual(alignUp(8, 4), 8);
		strictEqual(alignUp(9, 4), 12);
		strictEqual(alignUp(10, 4), 12);
		strictEqual(alignUp(11, 4), 12);
		strictEqual(alignUp(12, 4), 12);
		strictEqual(alignUp(13, 4), 16);
		strictEqual(alignUp(14, 4), 16);
		strictEqual(alignUp(15, 4), 16);
		strictEqual(alignUp(16, 4), 16);
		strictEqual(alignUp(17, 4), 20);
		strictEqual(alignUp(18, 4), 20);
		strictEqual(alignUp(19, 4), 20);
		strictEqual(alignUp(20, 4), 20);
	});
});
