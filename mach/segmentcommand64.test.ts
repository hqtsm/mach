import { assertEquals } from '@std/assert';
import { SegmentCommand64 } from './segmentcommand64.ts';

Deno.test('BYTE_LENGTH', () => {
	assertEquals(SegmentCommand64.BYTE_LENGTH, 72);
});
