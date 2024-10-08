import {describe, it} from 'node:test';
import {strictEqual} from 'node:assert';

import {DetachedSignatureBlob} from './detachedsignatureblob.ts';

void describe('detachedsignatureblob', () => {
	void it('sizeof', () => {
		strictEqual(DetachedSignatureBlob.sizeof, 12);
	});
});
