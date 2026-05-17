import { assertEquals } from '@std/assert';
import { DERItemSpec } from './libDER.ts';

Deno.test('DERItemSpec', () => {
	{
		const spec = new DERItemSpec();
		assertEquals(spec.offset, 0);
		assertEquals(spec.tag, 0n);
		assertEquals(spec.length, 0);
	}
	{
		const spec = new DERItemSpec(1, 2n, 3);
		assertEquals(spec.offset, 1);
		assertEquals(spec.tag, 2n);
		assertEquals(spec.length, 3);
	}
});
