import {describe, it} from 'node:test';
import {strictEqual} from 'node:assert';

import {MachHeader} from './machheader.ts';

void describe('MachHeader', () => {
	void it('sizeof', () => {
		strictEqual(MachHeader.sizeof, 28);
	});
});
