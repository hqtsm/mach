import { assertEquals } from '@std/assert';

import { SegmentCommand } from './segmentcommand.ts';

Deno.test('BYTE_LENGTH', () => {
	assertEquals(SegmentCommand.BYTE_LENGTH, 56);
});
