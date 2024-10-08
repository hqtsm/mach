import {describe, it} from 'node:test';
import {strictEqual} from 'node:assert';

import {MachHeader64} from './machheader64.ts';

void describe('MachHeader64', () => {
	void it('sizeof', () => {
		strictEqual(MachHeader64.sizeof, 32);
	});
});
