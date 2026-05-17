import { Uint8Ptr } from '@hqtsm/struct';
import { assertEquals } from '@std/assert';
import { DERSequence } from './DER_Decode.ts';

Deno.test('DERSequence', () => {
	{
		const spec = new DERSequence();
		assertEquals(spec.nextItem, null);
		assertEquals(spec.end, null);
	}
	{
		const nextItem = new Uint8Ptr(new ArrayBuffer(1));
		const end = new Uint8Ptr(nextItem.buffer, nextItem.byteOffset + 1);
		const spec = new DERSequence(nextItem, end);
		assertEquals(spec.nextItem, nextItem);
		assertEquals(spec.end, end);
	}
});
