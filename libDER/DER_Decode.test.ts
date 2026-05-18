import { Uint8Ptr } from '@hqtsm/struct';
import {
	assertEquals,
	assertInstanceOf,
	assertStrictEquals,
} from '@std/assert';
import { unhex } from '../spec/hex.ts';
import {
	DERDecodedInfo,
	DERDecodeItem,
	DERDecodeItemPartialBuffer,
	DERDecodeItemPartialBufferGetLength,
	DERDecodeSeqContentInit,
	DERSequence,
} from './DER_Decode.ts';
import { DERItem } from './DERItem.ts';
import { DR_DecodeError, DR_Success } from './libDER.ts';
import type { _const } from '../libc/c.ts';

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
