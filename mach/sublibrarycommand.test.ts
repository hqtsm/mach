import { assertEquals } from '@std/assert';

import { SubLibraryCommand } from './sublibrarycommand.ts';

Deno.test('BYTE_LENGTH', () => {
	assertEquals(SubLibraryCommand.BYTE_LENGTH, 12);
});
