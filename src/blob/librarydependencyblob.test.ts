import {describe, it} from 'node:test';
import {strictEqual} from 'node:assert';

import {LibraryDependencyBlob} from './librarydependencyblob.ts';

void describe('LibraryDependencyBlob', () => {
	void it('BYTE_LENGTH', () => {
		strictEqual(LibraryDependencyBlob.BYTE_LENGTH, 12);
	});
});
