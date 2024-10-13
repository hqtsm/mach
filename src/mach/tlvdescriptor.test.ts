import {describe, it} from 'node:test';
import {strictEqual} from 'node:assert';

import {TlvDescriptor} from './tlvdescriptor.ts';

void describe('TlvDescriptor', () => {
	void it('BYTE_LENGTH', () => {
		strictEqual(TlvDescriptor.BYTE_LENGTH, 12);
	});
});
