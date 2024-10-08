import {describe, it} from 'node:test';
import {strictEqual} from 'node:assert';

import {BlobWrapper} from './blobwrapper.ts';

void describe('BlobWrapper', () => {
	void it('sizeof', () => {
		strictEqual(BlobWrapper.sizeof, 8);
	});
});
