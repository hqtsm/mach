import {describe, it} from 'node:test';
import {strictEqual} from 'node:assert';

import {BuildToolVersion} from './buildtoolversion.ts';

void describe('BuildToolVersion', () => {
	void it('BYTE_LENGTH', () => {
		strictEqual(BuildToolVersion.BYTE_LENGTH, 8);
	});
});
