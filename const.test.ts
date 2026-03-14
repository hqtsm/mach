import { assertEquals } from '@std/assert';
import * as C from './const.ts';

Deno.test('constants expressions', () => {
	assertEquals(
		C.CSSLOT_ALTERNATE_CODEDIRECTORY_LIMIT,
		C.CSSLOT_ALTERNATE_CODEDIRECTORIES +
			C.CSSLOT_ALTERNATE_CODEDIRECTORY_MAX,
	);
});
