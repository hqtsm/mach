import { assertEquals } from '@std/assert';

import { LibraryDependencyBlob } from './librarydependencyblob.ts';

Deno.test('BYTE_LENGTH', () => {
	assertEquals(LibraryDependencyBlob.BYTE_LENGTH, 12);
});
