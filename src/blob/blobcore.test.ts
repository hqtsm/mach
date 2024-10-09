import {describe, it} from 'node:test';
import {strictEqual} from 'node:assert';

import {BlobWrapper} from './blobwrapper.ts';

void describe('BlobWrapper', () => {
	void it('BYTE_LENGTH', () => {
		strictEqual(BlobWrapper.BYTE_LENGTH, 8);
	});
});
