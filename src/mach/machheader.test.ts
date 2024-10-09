import {describe, it} from 'node:test';
import {strictEqual} from 'node:assert';

import {MachHeader} from './machheader.ts';

void describe('MachHeader', () => {
	void it('BYTE_LENGTH', () => {
		strictEqual(MachHeader.BYTE_LENGTH, 28);
	});
});
