import {describe, it} from 'node:test';
import {strictEqual} from 'node:assert';

import {SuperBlob} from './superblob.ts';

void describe('SuperBlob', () => {
	void it('sizeof', () => {
		strictEqual(SuperBlob.sizeof, 12);
	});
});
