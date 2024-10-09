import {describe, it} from 'node:test';
import {strictEqual} from 'node:assert';

import {DetachedSignatureBlob} from './detachedsignatureblob.ts';

void describe('DetachedSignatureBlob', () => {
	void it('BYTE_LENGTH', () => {
		strictEqual(DetachedSignatureBlob.BYTE_LENGTH, 12);
	});
});
