import {describe, it} from 'node:test';
import {deepStrictEqual, strictEqual} from 'node:assert';

import {alignUp, getInt24, getUint24, setInt24, setUint24} from './util.ts';

void describe('alignUp', () => {
	void it('unsigned', () => {
		strictEqual(alignUp(0, 4), 0);
		strictEqual(alignUp(1, 4), 4);
		strictEqual(alignUp(2, 4), 4);
		strictEqual(alignUp(3, 4), 4);
		strictEqual(alignUp(4, 4), 4);
		strictEqual(alignUp(5, 4), 8);
		strictEqual(alignUp(6, 4), 8);
		strictEqual(alignUp(7, 4), 8);
		strictEqual(alignUp(8, 4), 8);
		strictEqual(alignUp(9, 4), 12);
		strictEqual(alignUp(10, 4), 12);
		strictEqual(alignUp(11, 4), 12);
		strictEqual(alignUp(12, 4), 12);
		strictEqual(alignUp(13, 4), 16);
		strictEqual(alignUp(14, 4), 16);
		strictEqual(alignUp(15, 4), 16);
		strictEqual(alignUp(16, 4), 16);
		strictEqual(alignUp(17, 4), 20);
		strictEqual(alignUp(18, 4), 20);
		strictEqual(alignUp(19, 4), 20);
		strictEqual(alignUp(20, 4), 20);
	});
});

void describe('getInt24', () => {
	void it('unsigned', () => {
		const data = new Uint8Array([0x12, 0x34, 0x56]);
		const dataView = new DataView(data.buffer);
		strictEqual(getInt24(dataView, 0, false), 0x123456);
		strictEqual(getInt24(dataView, 0, true), 0x563412);
	});

	void it('signed', () => {
		const data = new Uint8Array([0xff, 0xfe, 0xfd]);
		const dataView = new DataView(data.buffer);
		// eslint-disable-next-line no-bitwise
		strictEqual(getInt24(dataView, 0, false), (0xfffefd << 8) >> 8);
		// eslint-disable-next-line no-bitwise
		strictEqual(getInt24(dataView, 0, true), (0xfdfeff << 8) >> 8);
	});
});

void describe('setInt24', () => {
	void it('unsigned', () => {
		const data = new Uint8Array(3);
		const dataView = new DataView(data.buffer);
		setInt24(dataView, 0, 0x123456, false);
		deepStrictEqual(data, new Uint8Array([0x12, 0x34, 0x56]));
		setInt24(dataView, 0, 0x123456, true);
		deepStrictEqual(data, new Uint8Array([0x56, 0x34, 0x12]));
	});

	void it('signed', () => {
		const data = new Uint8Array(3);
		const dataView = new DataView(data.buffer);
		// eslint-disable-next-line no-bitwise
		setInt24(dataView, 0, (0xfffefd << 8) >> 8, false);
		deepStrictEqual(data, new Uint8Array([0xff, 0xfe, 0xfd]));
		// eslint-disable-next-line no-bitwise
		setInt24(dataView, 0, (0xfffefd << 8) >> 8, true);
		deepStrictEqual(data, new Uint8Array([0xfd, 0xfe, 0xff]));
	});
});

void describe('getUint24', () => {
	void it('unsigned', () => {
		const data = new Uint8Array([0x12, 0x34, 0x56]);
		const dataView = new DataView(data.buffer);
		strictEqual(getUint24(dataView, 0, false), 0x123456);
		strictEqual(getUint24(dataView, 0, true), 0x563412);
	});

	void it('signed', () => {
		const data = new Uint8Array([0xff, 0xfe, 0xfd]);
		const dataView = new DataView(data.buffer);
		strictEqual(getUint24(dataView, 0, false), 0xfffefd);
		strictEqual(getUint24(dataView, 0, true), 0xfdfeff);
	});
});

void describe('setUint24', () => {
	void it('unsigned', () => {
		const data = new Uint8Array(3);
		const dataView = new DataView(data.buffer);
		setUint24(dataView, 0, 0x123456, false);
		deepStrictEqual(data, new Uint8Array([0x12, 0x34, 0x56]));
		setUint24(dataView, 0, 0x123456, true);
		deepStrictEqual(data, new Uint8Array([0x56, 0x34, 0x12]));
	});

	void it('signed', () => {
		const data = new Uint8Array(3);
		const dataView = new DataView(data.buffer);
		// eslint-disable-next-line no-bitwise
		setUint24(dataView, 0, (0xfffefd << 8) >> 8, false);
		deepStrictEqual(data, new Uint8Array([0xff, 0xfe, 0xfd]));
		// eslint-disable-next-line no-bitwise
		setUint24(dataView, 0, (0xfffefd << 8) >> 8, true);
		deepStrictEqual(data, new Uint8Array([0xfd, 0xfe, 0xff]));
	});
});
