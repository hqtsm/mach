import { assertEquals } from '@std/assert';
import { cssm_data } from './SecAsn1Types.ts';

Deno.test('cssm_data', () => {
	const cd = new cssm_data();
	assertEquals(cd.Length, 0);
	assertEquals(cd.Data, null);
});
