import { assertEquals } from '@std/assert';
import { Security_LowLevelMemoryUtilities_alignUp } from './memutils.ts';

Deno.test('alignUp unsigned', () => {
	assertEquals(Security_LowLevelMemoryUtilities_alignUp(0), 0);
	assertEquals(Security_LowLevelMemoryUtilities_alignUp(1), 4);
	assertEquals(Security_LowLevelMemoryUtilities_alignUp(2), 4);
	assertEquals(Security_LowLevelMemoryUtilities_alignUp(3), 4);
	assertEquals(Security_LowLevelMemoryUtilities_alignUp(4), 4);
	assertEquals(Security_LowLevelMemoryUtilities_alignUp(5), 8);
	assertEquals(Security_LowLevelMemoryUtilities_alignUp(6), 8);
	assertEquals(Security_LowLevelMemoryUtilities_alignUp(7), 8);
	assertEquals(Security_LowLevelMemoryUtilities_alignUp(8), 8);
	assertEquals(Security_LowLevelMemoryUtilities_alignUp(9), 12);
	assertEquals(Security_LowLevelMemoryUtilities_alignUp(10), 12);
	assertEquals(Security_LowLevelMemoryUtilities_alignUp(11), 12);
	assertEquals(Security_LowLevelMemoryUtilities_alignUp(12), 12);
	assertEquals(Security_LowLevelMemoryUtilities_alignUp(13), 16);
	assertEquals(Security_LowLevelMemoryUtilities_alignUp(14), 16);
	assertEquals(Security_LowLevelMemoryUtilities_alignUp(15), 16);
	assertEquals(Security_LowLevelMemoryUtilities_alignUp(16), 16);
	assertEquals(Security_LowLevelMemoryUtilities_alignUp(17), 20);
	assertEquals(Security_LowLevelMemoryUtilities_alignUp(18), 20);
	assertEquals(Security_LowLevelMemoryUtilities_alignUp(19), 20);
	assertEquals(Security_LowLevelMemoryUtilities_alignUp(20), 20);
});
