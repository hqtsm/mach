import { assertEquals } from '@std/assert';

import { DylibTableOfContents } from './dylibtableofcontents.ts';

Deno.test('BYTE_LENGTH', () => {
	assertEquals(DylibTableOfContents.BYTE_LENGTH, 8);
});
