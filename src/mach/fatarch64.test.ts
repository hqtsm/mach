import {describe, it} from 'node:test';
import {strictEqual} from 'node:assert';

import {FatArch64} from './fatarch64.ts';

void describe('FatArch64', () => {
	void it('BYTE_LENGTH', () => {
		strictEqual(FatArch64.BYTE_LENGTH, 32);
	});
});
