import { assertEquals } from '@std/assert';

import { alignUp, getInt24, getUint24, setInt24, setUint24 } from './util.ts';

Deno.test('alignUp unsigned', () => {
	assertEquals(alignUp(0, 4), 0);
	assertEquals(alignUp(1, 4), 4);
	assertEquals(alignUp(2, 4), 4);
	assertEquals(alignUp(3, 4), 4);
	assertEquals(alignUp(4, 4), 4);
	assertEquals(alignUp(5, 4), 8);
	assertEquals(alignUp(6, 4), 8);
	assertEquals(alignUp(7, 4), 8);
	assertEquals(alignUp(8, 4), 8);
	assertEquals(alignUp(9, 4), 12);
	assertEquals(alignUp(10, 4), 12);
	assertEquals(alignUp(11, 4), 12);
	assertEquals(alignUp(12, 4), 12);
	assertEquals(alignUp(13, 4), 16);
	assertEquals(alignUp(14, 4), 16);
	assertEquals(alignUp(15, 4), 16);
	assertEquals(alignUp(16, 4), 16);
	assertEquals(alignUp(17, 4), 20);
	assertEquals(alignUp(18, 4), 20);
	assertEquals(alignUp(19, 4), 20);
	assertEquals(alignUp(20, 4), 20);
});

Deno.test('getInt24 unsigned', () => {
	const data = new Uint8Array([0x12, 0x34, 0x56]);
	const dataView = new DataView(data.buffer);
	assertEquals(getInt24(dataView, 0, false), 0x123456);
	assertEquals(getInt24(dataView, 0, true), 0x563412);
});

Deno.test('getInt24 signed', () => {
	const data = new Uint8Array([0xff, 0xfe, 0xfd]);
	const dataView = new DataView(data.buffer);
	assertEquals(getInt24(dataView, 0, false), (0xfffefd << 8) >> 8);
	assertEquals(getInt24(dataView, 0, true), (0xfdfeff << 8) >> 8);
});

Deno.test('setInt24 unsigned', () => {
	const data = new Uint8Array(3);
	const dataView = new DataView(data.buffer);
	setInt24(dataView, 0, 0x123456, false);
	assertEquals(data, new Uint8Array([0x12, 0x34, 0x56]));
	setInt24(dataView, 0, 0x123456, true);
	assertEquals(data, new Uint8Array([0x56, 0x34, 0x12]));
});

Deno.test('setInt24 signed', () => {
	const data = new Uint8Array(3);
	const dataView = new DataView(data.buffer);
	setInt24(dataView, 0, (0xfffefd << 8) >> 8, false);
	assertEquals(data, new Uint8Array([0xff, 0xfe, 0xfd]));
	setInt24(dataView, 0, (0xfffefd << 8) >> 8, true);
	assertEquals(data, new Uint8Array([0xfd, 0xfe, 0xff]));
});

Deno.test('getUint24 unsigned', () => {
	const data = new Uint8Array([0x12, 0x34, 0x56]);
	const dataView = new DataView(data.buffer);
	assertEquals(getUint24(dataView, 0, false), 0x123456);
	assertEquals(getUint24(dataView, 0, true), 0x563412);
});

Deno.test('getUint24 signed', () => {
	const data = new Uint8Array([0xff, 0xfe, 0xfd]);
	const dataView = new DataView(data.buffer);
	assertEquals(getUint24(dataView, 0, false), 0xfffefd);
	assertEquals(getUint24(dataView, 0, true), 0xfdfeff);
});

Deno.test('setUint24 unsigned', () => {
	const data = new Uint8Array(3);
	const dataView = new DataView(data.buffer);
	setUint24(dataView, 0, 0x123456, false);
	assertEquals(data, new Uint8Array([0x12, 0x34, 0x56]));
	setUint24(dataView, 0, 0x123456, true);
	assertEquals(data, new Uint8Array([0x56, 0x34, 0x12]));
});

Deno.test('setUint24 signed', () => {
	const data = new Uint8Array(3);
	const dataView = new DataView(data.buffer);
	setUint24(dataView, 0, (0xfffefd << 8) >> 8, false);
	assertEquals(data, new Uint8Array([0xff, 0xfe, 0xfd]));
	setUint24(dataView, 0, (0xfffefd << 8) >> 8, true);
	assertEquals(data, new Uint8Array([0xfd, 0xfe, 0xff]));
});
