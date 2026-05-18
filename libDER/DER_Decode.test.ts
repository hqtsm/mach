import { Uint8Ptr } from '@hqtsm/struct';
import {
	assertEquals,
	assertInstanceOf,
	assertStrictEquals,
} from '@std/assert';
import { DERDecodeSeqContentInit, DERSequence } from './DER_Decode.ts';
import { DERItem } from './DERItem.ts';
import { DR_Success } from './libDER.ts';

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

Deno.test('DERDecodeSeqContentInit', () => {
	const ab = new ArrayBuffer(10);
	const ptr = new Uint8Ptr(ab);
	const di = new DERItem(ptr, ab.byteLength);
	const derSeq = new DERSequence();
	assertEquals(DERDecodeSeqContentInit(di, derSeq), DR_Success);
	assertStrictEquals(derSeq.nextItem, ptr);
	assertInstanceOf(derSeq.end, Uint8Ptr);
	assertStrictEquals(derSeq.end.buffer, ab);
	assertStrictEquals(derSeq.end.byteOffset, ab.byteLength);
});
