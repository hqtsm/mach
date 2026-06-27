import { Uint8Ptr } from '@hqtsm/struct';
import { assertEquals } from '@std/assert';
import { DERItem } from './DERItem.ts';
import { DEROidCompare } from './oidsPriv.ts';

Deno.test('DEROidCompare', () => {
	const aData = new Uint8Ptr(new ArrayBuffer(2));
	const bData = new Uint8Ptr(new ArrayBuffer(2));
	const a = new DERItem(aData, 2);
	const b = new DERItem(bData, 2);

	aData[0] = 1;
	aData[1] = 2;
	bData[0] = 1;
	bData[1] = 2;
	assertEquals(DEROidCompare(a, b), true);

	bData[1] = 3;
	assertEquals(DEROidCompare(a, b), false);

	bData[0] = 2;
	b.length = 1;
	assertEquals(DEROidCompare(a, b), false);

	assertEquals(DEROidCompare(a, null), false);
	assertEquals(DEROidCompare(null, b), false);
});
