import {describe, it} from 'node:test';
import {strictEqual} from 'node:assert';

import {SegmentCommand64} from './segmentcommand64.ts';

void describe('SegmentCommand64', () => {
	void it('sizeof', () => {
		strictEqual(SegmentCommand64.sizeof, 72);
	});
});
