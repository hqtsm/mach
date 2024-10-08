import {describe, it} from 'node:test';
import {strictEqual} from 'node:assert';

import {SuperBlob} from './superblob.ts';

void describe('superblob', () => {
	void it('sizeof', () => {
		strictEqual(SuperBlob.sizeof, 12);
	});
});
