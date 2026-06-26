import { assertInstanceOf, assertStrictEquals } from '@std/assert';
import { DERAttributeTypeAndValue } from './DER_CertCrl.ts';
import { DERItem } from './DERItem.ts';

Deno.test('DERAttributeTypeAndValue', () => {
	{
		const da = new DERAttributeTypeAndValue();
		assertInstanceOf(da.type, DERItem);
		assertInstanceOf(da.value, DERItem);
	}
	{
		const type = new DERItem();
		const value = new DERItem();
		const da = new DERAttributeTypeAndValue(type, value);
		assertStrictEquals(da.type, type);
		assertStrictEquals(da.value, value);
	}
});
