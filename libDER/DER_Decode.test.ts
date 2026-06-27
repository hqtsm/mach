import { Uint8Ptr } from '@hqtsm/struct';
import {
	assertEquals,
	assertInstanceOf,
	assertStrictEquals,
} from '@std/assert';
import { unhex } from '../spec/mod.ts';
import {
	DER_DEC_NO_OPTS,
	DER_DEC_OPTIONAL,
	DER_DEC_SAVE_DER,
	DERDecodedInfo,
	DERDecodeItem,
	DERDecodeItemPartialBuffer,
	DERDecodeItemPartialBufferGetLength,
	DERDecodeSeqContentInit,
	DERDecodeSeqNext,
	DERParseSequenceContent,
	DERSequence,
} from './DER_Decode.ts';
import { DERItem } from './DERItem.ts';
import {
	DR_DecodeError,
	DR_EndOfSequence,
	DR_IncompleteSeq,
	DR_Success,
	DR_UnexpectedTag,
} from './libDER.ts';
import type { _const } from '../libc/mod.ts';

Deno.test('DERDecodedInfo', () => {
	{
		const di = new DERDecodedInfo();
		assertEquals(di.tag, 0n);
		assertInstanceOf(di.content, DERItem);
	}
	{
		const item = new DERItem();
		const di = new DERDecodedInfo(42n, item);
		assertEquals(di.tag, 42n);
		assertStrictEquals(di.content, item);
	}
});

Deno.test('DERDecodeItem*: empty item', () => {
	const item = new DERItem();
	{
		const dec = new DERDecodedInfo();
		assertEquals(DERDecodeItem(item, dec), DR_DecodeError);
		assertEquals(dec.content.length, 0);
		assertEquals(dec.content.data, null);
	}
	{
		const dec = new DERDecodedInfo();
		assertEquals(
			DERDecodeItemPartialBuffer(item, dec, false),
			DR_DecodeError,
		);
		assertEquals(dec.content.length, 0);
		assertEquals(dec.content.data, null);
	}
});

Deno.test('DERDecodeItem*: tag long bad', () => {
	const data = new Uint8Array([0x1F, 0x1F - 1]);
	const item = new DERItem(new Uint8Ptr(data.buffer), data.byteLength);
	{
		const dec = new DERDecodedInfo();
		assertEquals(DERDecodeItem(item, dec), DR_DecodeError);
		assertEquals(dec.content.length, 0);
		assertEquals(dec.content.data, null);
	}
	{
		const dec = new DERDecodedInfo();
		assertEquals(
			DERDecodeItemPartialBuffer(item, dec, false),
			DR_DecodeError,
		);
		assertEquals(dec.content.length, 0);
		assertEquals(dec.content.data, null);
	}
});

Deno.test('DERDecodeItem*: tag long over', () => {
	const data = unhex('1F FF FF FF FF FF FF FF FF FF 00');
	const item = new DERItem(new Uint8Ptr(data.buffer), data.byteLength);
	{
		const dec = new DERDecodedInfo();
		assertEquals(DERDecodeItem(item, dec), DR_DecodeError);
		assertEquals(dec.content.length, 0);
		assertEquals(dec.content.data, null);
	}
	{
		const dec = new DERDecodedInfo();
		assertEquals(
			DERDecodeItemPartialBuffer(item, dec, false),
			DR_DecodeError,
		);
		assertEquals(dec.content.length, 0);
		assertEquals(dec.content.data, null);
	}
});

Deno.test('DERDecodeItem*: tag long reserved', () => {
	const data = unhex('FF FF FF FF FF FF FF FF FF 00 00');
	const item = new DERItem(new Uint8Ptr(data.buffer), data.byteLength);
	{
		const dec = new DERDecodedInfo();
		assertEquals(DERDecodeItem(item, dec), DR_DecodeError);
		assertEquals(dec.content.length, 0);
		assertEquals(dec.content.data, null);
	}
	{
		const dec = new DERDecodedInfo();
		assertEquals(
			DERDecodeItemPartialBuffer(item, dec, false),
			DR_DecodeError,
		);
		assertEquals(dec.content.length, 0);
		assertEquals(dec.content.data, null);
	}
});

Deno.test('DERDecodeItem*: tag before error', () => {
	const data = unhex('EF 80 00');
	const item = new DERItem(new Uint8Ptr(data.buffer), data.byteLength);
	{
		const dec = new DERDecodedInfo();
		assertEquals(DERDecodeItem(item, dec), DR_DecodeError);
		assertEquals(dec.tag, 0xe00000000000000fn);
		assertEquals(dec.content.length, 0);
		assertEquals(dec.content.data, null);
	}
	{
		const dec = new DERDecodedInfo();
		assertEquals(
			DERDecodeItemPartialBuffer(item, dec, false),
			DR_DecodeError,
		);
		assertEquals(dec.tag, 0xe00000000000000fn);
		assertEquals(dec.content.length, 0);
		assertEquals(dec.content.data, null);
	}
});

Deno.test('DERDecodeItem*: empty body', () => {
	const data = unhex('0A 00');
	const item = new DERItem(new Uint8Ptr(data.buffer), data.byteLength);
	{
		const dec = new DERDecodedInfo();
		assertEquals(
			DERDecodeItemPartialBuffer(item, dec, false),
			DR_Success,
		);
		assertEquals(dec.tag, 0xAn);
		assertEquals(dec.content.length, 0);
		assertEquals(dec.content.data!.byteOffset, 2);
	}
	{
		const dec = new DERDecodedInfo();
		const len = [] as number[];
		assertEquals(
			DERDecodeItemPartialBufferGetLength(item, dec, len),
			DR_Success,
		);
		assertEquals(dec.tag, 0xAn);
		assertEquals(len[0], 0);
		assertEquals(dec.content.length, 0);
		assertEquals(dec.content.data!.byteOffset, 2);
	}
});

Deno.test('DERDecodeItem*: short body', () => {
	const data = unhex('0A 01 42');
	const item = new DERItem(new Uint8Ptr(data.buffer), data.byteLength);
	{
		const dec = new DERDecodedInfo();
		assertEquals(
			DERDecodeItemPartialBuffer(item, dec, false),
			DR_Success,
		);
		assertEquals(dec.tag, 0xAn);
		assertEquals(dec.content.length, 1);
		assertEquals(dec.content.data!.byteOffset, 2);
	}
	{
		const dec = new DERDecodedInfo();
		const len = [] as number[];
		assertEquals(
			DERDecodeItemPartialBufferGetLength(item, dec, len),
			DR_Success,
		);
		assertEquals(dec.tag, 0xAn);
		assertEquals(len[0], 1);
		assertEquals(dec.content.length, 1);
		assertEquals(dec.content.data!.byteOffset, 2);
	}
});

Deno.test('DERDecodeItem*: short body overflow', () => {
	const data = unhex('0A 02 42');
	const item = new DERItem(new Uint8Ptr(data.buffer), data.byteLength);
	{
		const dec = new DERDecodedInfo();
		assertEquals(
			DERDecodeItem(item, dec),
			DR_DecodeError,
		);
		assertEquals(dec.tag, 0xAn);
		assertEquals(dec.content.length, 0);
		assertEquals(dec.content.data, null);
	}
	{
		const dec = new DERDecodedInfo();
		assertEquals(
			DERDecodeItemPartialBuffer(item, dec, false),
			DR_DecodeError,
		);
		assertEquals(
			DERDecodeItemPartialBuffer(item, dec, true),
			DR_Success,
		);
		assertEquals(dec.tag, 0xAn);
		assertEquals(dec.content.length, 2);
		assertEquals(dec.content.data!.byteOffset, 2);
	}
	{
		const dec = new DERDecodedInfo();
		const len = [] as number[];
		assertEquals(
			DERDecodeItemPartialBufferGetLength(item, dec, len),
			DR_Success,
		);
		assertEquals(dec.tag, 0xAn);
		assertEquals(len[0], 2);
		assertEquals(dec.content.length, 1);
		assertEquals(dec.content.data!.byteOffset, 2);
	}
});

Deno.test('DERDecodeItem*: short body extra', () => {
	const data = unhex('0A 00 EE');
	const item = new DERItem(new Uint8Ptr(data.buffer), data.byteLength);
	{
		const dec = new DERDecodedInfo();
		assertEquals(
			DERDecodeItemPartialBuffer(item, dec, false),
			DR_Success,
		);
		assertEquals(dec.tag, 0xAn);
		assertEquals(dec.content.length, 0);
		assertEquals(dec.content.data!.byteOffset, 2);
	}
	{
		const dec = new DERDecodedInfo();
		const len = [] as number[];
		assertEquals(
			DERDecodeItemPartialBufferGetLength(item, dec, len),
			DR_Success,
		);
		assertEquals(dec.tag, 0xAn);
		assertEquals(len[0], 0);
		assertEquals(dec.content.length, 0);
		assertEquals(dec.content.data!.byteOffset, 2);
	}
});

Deno.test('DERDecodeItem*: long body bad size', () => {
	const data = unhex('0A 81 00');
	const item = new DERItem(new Uint8Ptr(data.buffer), data.byteLength);
	const dec = new DERDecodedInfo();
	{
		const dec = new DERDecodedInfo();
		assertEquals(
			DERDecodeItemPartialBuffer(item, dec, false),
			DR_DecodeError,
		);
		assertEquals(dec.tag, 0xAn);
		assertEquals(dec.content.length, 0);
		assertEquals(dec.content.data, null);
	}
	{
		const len = [] as number[];
		assertEquals(
			DERDecodeItemPartialBufferGetLength(item, dec, len),
			DR_DecodeError,
		);
		assertEquals(dec.tag, 0xAn);
		assertEquals(dec.content.length, 0);
		assertEquals(dec.content.data, null);
	}
});

Deno.test('DERDecodeItem*: long body overflow', () => {
	const data = unhex('0A 81 FF 00 00');
	const item = new DERItem(new Uint8Ptr(data.buffer), data.byteLength);
	{
		const dec = new DERDecodedInfo();
		assertEquals(
			DERDecodeItem(item, dec),
			DR_DecodeError,
		);
		assertEquals(dec.tag, 0xAn);
		assertEquals(dec.content.length, 0);
		assertEquals(dec.content.data, null);
	}
	{
		const dec = new DERDecodedInfo();
		assertEquals(
			DERDecodeItemPartialBuffer(item, dec, false),
			DR_DecodeError,
		);
		assertEquals(
			DERDecodeItemPartialBuffer(item, dec, true),
			DR_Success,
		);
		assertEquals(dec.tag, 0xAn);
		assertEquals(dec.content.length, 255);
		assertEquals(dec.content.data!.byteOffset, 3);
	}
	{
		const dec = new DERDecodedInfo();
		const len = [] as number[];
		assertEquals(
			DERDecodeItemPartialBufferGetLength(item, dec, len),
			DR_Success,
		);
		assertEquals(dec.tag, 0xAn);
		assertEquals(len[0], 255);
		assertEquals(dec.content.length, 2);
		assertEquals(dec.content.data!.byteOffset, 3);
	}
});

Deno.test('DERDecodeItem*: long body extra', () => {
	const data = new Uint8Array([
		...unhex('0A 81 FF 00'),
		...new Uint8Array(256),
	]);
	const item = new DERItem(new Uint8Ptr(data.buffer), data.byteLength);
	{
		const dec = new DERDecodedInfo();
		assertEquals(
			DERDecodeItemPartialBuffer(item, dec, false),
			DR_Success,
		);
		assertEquals(dec.tag, 0xAn);
		assertEquals(dec.content.length, 255);
		assertEquals(dec.content.data!.byteOffset, 3);
	}
	{
		const dec = new DERDecodedInfo();
		const len = [] as number[];
		assertEquals(
			DERDecodeItemPartialBufferGetLength(item, dec, len),
			DR_Success,
		);
		assertEquals(dec.tag, 0xAn);
		assertEquals(len[0], 255);
		assertEquals(dec.content.length, 255);
		assertEquals(dec.content.data!.byteOffset, 3);
	}
});

Deno.test('DERSequence', () => {
	{
		const spec = new DERSequence();
		assertEquals(spec.nextItem, null);
		assertEquals(spec.end, null);
	}
	{
		const ab = new ArrayBuffer(10);
		const nextItem = new Uint8Ptr(ab);
		const end = new Uint8Ptr(
			nextItem.buffer,
			nextItem.byteOffset + ab.byteLength,
		);
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

Deno.test('DERDecodeSeqNext: sequence', () => {
	const data = unhex('0A 01 AA 0B 01 BB');
	const item = new DERItem(new Uint8Ptr(data.buffer), data.byteLength);
	const derSeq = new DERSequence();
	const di = new DERDecodedInfo();
	assertEquals(DERDecodeSeqContentInit(item, derSeq), DR_Success);

	assertEquals(DERDecodeSeqNext(derSeq, di), DR_Success);
	assertEquals(di.tag, 0xAn);
	assertEquals(di.content.length, 1);
	assertEquals(di.content.data!.byteOffset, 2);

	assertEquals(DERDecodeSeqNext(derSeq, di), DR_Success);
	assertEquals(di.tag, 0xBn);
	assertEquals(di.content.length, 1);
	assertEquals(di.content.data!.byteOffset, 5);

	assertEquals(DERDecodeSeqNext(derSeq, di), DR_EndOfSequence);
	assertEquals(DERDecodeSeqNext(derSeq, di), DR_EndOfSequence);
});

Deno.test('DERDecodeSeqNext: error', () => {
	const data = unhex('0A 01');
	const item = new DERItem(new Uint8Ptr(data.buffer), data.byteLength);
	const derSeq = new DERSequence();
	const di = new DERDecodedInfo();
	assertEquals(DERDecodeSeqContentInit(item, derSeq), DR_Success);

	assertEquals(DERDecodeSeqNext(derSeq, di), DR_DecodeError);
});

Deno.test('DERParseSequenceContent: sequence', () => {
	const data = unhex('0A 01 AA 0B 02 BB BB');
	const item = new DERItem(new Uint8Ptr(data.buffer), data.byteLength);

	const a = new DERItem();
	const b = new DERItem();
	const ret = DERParseSequenceContent(
		item,
		[
			['a', 0xAn, DER_DEC_NO_OPTS],
			['b', 0xBn, DER_DEC_NO_OPTS],
		] as const,
		{ a, b },
		false,
	);
	assertEquals(ret, DR_Success);

	assertEquals(a.length, 1);
	assertEquals(a.data!.byteOffset, 2);
	assertEquals(b.length, 2);
	assertEquals(b.data!.byteOffset, 5);
});

Deno.test('DERParseSequenceContent: optional', () => {
	const data = unhex('0A 01 AA 0C 03 CC CC CC');
	const item = new DERItem(new Uint8Ptr(data.buffer), data.byteLength);
	const ptr = new Uint8Ptr(new ArrayBuffer(1));

	const a = new DERItem(ptr, 1);
	const b = new DERItem(ptr, 1);
	const c = new DERItem(ptr, 1);
	const ret = DERParseSequenceContent(
		item,
		[
			['a', 0xAn, DER_DEC_NO_OPTS],
			['b', 0xBn, DER_DEC_OPTIONAL],
			['c', 0xCn, DER_DEC_NO_OPTS],
		],
		{ a, b, c },
		true,
	);
	assertEquals(ret, DR_Success);

	assertEquals(a.length, 1);
	assertEquals(a.data!.byteOffset, 2);
	assertEquals(b.length, 0);
	assertEquals(b.data, null);
	assertEquals(c.length, 3);
	assertEquals(c.data!.byteOffset, 5);
});

Deno.test('DERParseSequenceContent: optional end', () => {
	const data = unhex('0A 01 AA 0B 02 BB BB');
	const item = new DERItem(new Uint8Ptr(data.buffer), data.byteLength);

	const a = new DERItem();
	const b = new DERItem();
	const c = new DERItem();
	const ret = DERParseSequenceContent(
		item,
		[
			['a', 0xAn, DER_DEC_NO_OPTS],
			['b', 0xBn, DER_DEC_NO_OPTS],
			['c', 0xCn, DER_DEC_OPTIONAL],
		] as const,
		{ a, b, c },
		false,
	);
	assertEquals(ret, DR_Success);

	assertEquals(a.length, 1);
	assertEquals(a.data!.byteOffset, 2);
	assertEquals(b.length, 2);
	assertEquals(b.data!.byteOffset, 5);
	assertEquals(c.length, 0);
	assertEquals(c.data, null);
});

Deno.test('DERParseSequenceContent: save der', () => {
	const data = unhex('0A 01 AA 0B 02 BB BB');
	const item = new DERItem(new Uint8Ptr(data.buffer), data.byteLength);

	const a = new DERItem();
	const b = new DERItem();
	const ret = DERParseSequenceContent(
		item,
		[
			['a', 0xAn, DER_DEC_SAVE_DER],
			['b', 0xBn, DER_DEC_SAVE_DER],
		] as const,
		{ a, b },
		false,
	);
	assertEquals(ret, DR_Success);

	assertEquals(a.length, 3);
	assertEquals(a.data!.byteOffset, 0);
	assertEquals(b.length, 4);
	assertEquals(b.data!.byteOffset, 3);
});

Deno.test('DERParseSequenceContent: bad tag', () => {
	const data = unhex('0A 01 AA');
	const item = new DERItem(new Uint8Ptr(data.buffer), data.byteLength);

	const a = new DERItem();
	const ret = DERParseSequenceContent(
		item,
		[
			['a', 0xBn, DER_DEC_NO_OPTS],
		] as const,
		{ a },
		false,
	);
	assertEquals(ret, DR_UnexpectedTag);
});

Deno.test('DERParseSequenceContent: bad end', () => {
	const data = unhex('0A 01 AA');
	const item = new DERItem(new Uint8Ptr(data.buffer), data.byteLength);

	const a = new DERItem();
	const b = new DERItem();
	const ret = DERParseSequenceContent(
		item,
		[
			['a', 0xAn, DER_DEC_NO_OPTS],
			['b', 0xBn, DER_DEC_NO_OPTS],
		] as const,
		{ a, b },
		false,
	);
	assertEquals(ret, DR_IncompleteSeq);
});

Deno.test('DERParseSequenceContent: extra after', () => {
	const data = unhex('0A 01 AA 0B');
	const item = new DERItem(new Uint8Ptr(data.buffer), data.byteLength);

	const a = new DERItem();
	const ret = DERParseSequenceContent(
		item,
		[
			['a', 0xAn, DER_DEC_NO_OPTS],
		] as const,
		{ a },
		false,
	);
	assertEquals(ret, DR_DecodeError);
});

Deno.test('DERParseSequenceContent: incomplete tag', () => {
	const data = unhex('0A 01');
	const item = new DERItem(new Uint8Ptr(data.buffer), data.byteLength);

	const a = new DERItem();
	const ret = DERParseSequenceContent(
		item,
		[
			['a', 0xAn, DER_DEC_NO_OPTS],
		] as const,
		{ a },
		false,
	);
	assertEquals(ret, DR_DecodeError);
});

Deno.test('DERParseSequenceContent: bad optional end', () => {
	const data = unhex('0A 01 AA 0C 01 CC');
	const item = new DERItem(new Uint8Ptr(data.buffer), data.byteLength);

	const a = new DERItem();
	const b = new DERItem();
	const ret = DERParseSequenceContent(
		item,
		[
			['a', 0xAn, DER_DEC_NO_OPTS],
			['b', 0xBn, DER_DEC_OPTIONAL],
		] as const,
		{ a, b },
		false,
	);
	assertEquals(ret, DR_UnexpectedTag);
});

Deno.test('DERParseSequenceContent: empty', () => {
	const data = new Uint8Array();
	const item = new DERItem(new Uint8Ptr(data.buffer), data.byteLength);

	const ret = DERParseSequenceContent(
		item,
		[] as const,
		{},
		false,
	);
	assertEquals(ret, DR_Success);
});

Deno.test('DERParseSequenceContent: empty extra', () => {
	const data = new Uint8Array(1);
	const item = new DERItem(new Uint8Ptr(data.buffer), data.byteLength);

	const ret = DERParseSequenceContent(
		item,
		[] as const,
		{},
		false,
	);
	assertEquals(ret, DR_DecodeError);
});
