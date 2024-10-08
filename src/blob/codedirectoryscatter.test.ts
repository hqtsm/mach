import {describe, it} from 'node:test';
import {strictEqual} from 'node:assert';

import {CodeDirectoryScatter} from './codedirectoryscatter.ts';

void describe('CodeDirectoryScatter', () => {
	void it('sizeof', () => {
		strictEqual(CodeDirectoryScatter.sizeof, 24);
	});
});
