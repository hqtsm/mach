import {describe, it} from 'node:test';
import {strictEqual} from 'node:assert';

import {VersionMinCommand} from './versionmincommand.ts';

void describe('VersionMinCommand', () => {
	void it('BYTE_LENGTH', () => {
		strictEqual(VersionMinCommand.BYTE_LENGTH, 16);
	});
});
