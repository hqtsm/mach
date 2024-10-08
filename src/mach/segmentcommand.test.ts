import {describe, it} from 'node:test';
import {strictEqual} from 'node:assert';

import {SegmentCommand} from './segmentcommand.ts';

void describe('SegmentCommand', () => {
	void it('sizeof', () => {
		strictEqual(SegmentCommand.sizeof, 56);
	});
});
