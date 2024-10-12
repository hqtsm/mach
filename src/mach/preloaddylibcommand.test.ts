import {describe, it} from 'node:test';
import {strictEqual} from 'node:assert';

import {PreloadDylibCommand} from './preloaddylibcommand.ts';

void describe('PreloadDylibCommand', () => {
	void it('BYTE_LENGTH', () => {
		strictEqual(PreloadDylibCommand.BYTE_LENGTH, 20);
	});
});
