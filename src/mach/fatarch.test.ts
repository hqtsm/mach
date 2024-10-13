import {describe, it} from 'node:test';
import {strictEqual} from 'node:assert';

import {FatArch} from './fatarch.ts';

void describe('FatArch', () => {
	void it('BYTE_LENGTH', () => {
		strictEqual(FatArch.BYTE_LENGTH, 20);
	});
});
