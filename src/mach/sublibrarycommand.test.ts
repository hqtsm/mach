import {describe, it} from 'node:test';
import {strictEqual} from 'node:assert';

import {SubLibraryCommand} from './sublibrarycommand.ts';

void describe('SubLibraryCommand', () => {
	void it('BYTE_LENGTH', () => {
		strictEqual(SubLibraryCommand.BYTE_LENGTH, 12);
	});
});
