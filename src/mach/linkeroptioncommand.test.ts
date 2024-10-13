import {describe, it} from 'node:test';
import {strictEqual} from 'node:assert';

import {LinkerOptionCommand} from './linkeroptioncommand.ts';

void describe('LinkerOptionCommand', () => {
	void it('BYTE_LENGTH', () => {
		strictEqual(LinkerOptionCommand.BYTE_LENGTH, 12);
	});
});
