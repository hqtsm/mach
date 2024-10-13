import {describe, it} from 'node:test';
import {strictEqual} from 'node:assert';

import {TlvDescriptor64} from './tlvdescriptor64.ts';

void describe('TlvDescriptor64', () => {
	void it('BYTE_LENGTH', () => {
		strictEqual(TlvDescriptor64.BYTE_LENGTH, 24);
	});
});
