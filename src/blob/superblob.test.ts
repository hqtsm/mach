import {describe, it} from 'node:test';
import {strictEqual} from 'node:assert';

import {SuperBlob} from './superblob.ts';

void describe('SuperBlob', () => {
	void it('BYTE_LENGTH', () => {
		strictEqual(SuperBlob.BYTE_LENGTH, 12);
	});
});
