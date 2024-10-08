import {describe, it} from 'node:test';
import {strictEqual} from 'node:assert';

import {LibraryDependencyBlob} from './librarydependencyblob.ts';

void describe('librarydependencyblob', () => {
	void it('sizeof', () => {
		strictEqual(LibraryDependencyBlob.sizeof, 12);
	});
});
