import { Uint8Ptr } from '@hqtsm/struct';
import { assertEquals } from '@std/assert';
import { DERItem } from './DERItem.ts';

Deno.test('DERItem', () => {
	{
		const spec = new DERItem();
		assertEquals(spec.data, null);
		assertEquals(spec.length, 0);
	}
	{
		const data = new Uint8Ptr(new ArrayBuffer(1));
		const spec = new DERItem(data, 1);
		assertEquals(spec.data, data);
		assertEquals(spec.length, 1);
	}
});
