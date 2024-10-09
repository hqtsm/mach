import {describe, it} from 'node:test';
import {strictEqual} from 'node:assert';

import {CodeDirectoryScatter} from './codedirectoryscatter.ts';

void describe('CodeDirectoryScatter', () => {
	void it('BYTE_LENGTH', () => {
		strictEqual(CodeDirectoryScatter.BYTE_LENGTH, 24);
	});
});
