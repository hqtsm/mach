import {describe, it} from 'node:test';
import {strictEqual} from 'node:assert';

import {SegmentCommand} from './segmentcommand.ts';

void describe('SegmentCommand', () => {
	void it('BYTE_LENGTH', () => {
		strictEqual(SegmentCommand.BYTE_LENGTH, 56);
	});
});
