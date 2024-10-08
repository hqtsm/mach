import {describe, it} from 'node:test';
import {strictEqual} from 'node:assert';

import {BlobWrapper} from './blobwrapper.ts';

void describe('blobcore', () => {
	void it('sizeof', () => {
		strictEqual(BlobWrapper.sizeof, 8);
	});
});
