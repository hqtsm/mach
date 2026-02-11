import { assertEquals } from '@std/assert';
import { CSMAGIC_BLOBWRAPPER } from '../const.ts';
import { unhex } from '../spec/hex.ts';
import { BlobWrapper } from './blobwrapper.ts';

Deno.test('BYTE_LENGTH', () => {
	assertEquals(BlobWrapper.BYTE_LENGTH, 8);
});

Deno.test('length', () => {
	const bw = new BlobWrapper(new ArrayBuffer(BlobWrapper.BYTE_LENGTH));
	assertEquals(BlobWrapper.length(bw), -8);
	assertEquals(BlobWrapper.length(bw, 8), undefined);
	assertEquals(BlobWrapper.length(bw), 0);
	assertEquals(BlobWrapper.length(bw, 16), undefined);
	assertEquals(BlobWrapper.length(bw), 8);
});

Deno.test('empty', () => {
	const { BYTE_LENGTH } = BlobWrapper;
	const buffer = new ArrayBuffer(BYTE_LENGTH);
	const bw = new BlobWrapper(buffer);
	BlobWrapper.initializeSize(bw, BYTE_LENGTH);
	assertEquals(
		new Uint8Array(buffer),
		unhex('FA DE 0B 01 00 00 00 08'),
	);
});

Deno.test('alloc length', () => {
	const data = unhex('09 AB CD EF 01 02 03 04 05 06 07 08 09 0A 0B 0C');
	const bw = BlobWrapper.alloc(data.length);
	let ptr = BlobWrapper.data(bw);
	new Uint8Array(ptr.buffer, ptr.byteOffset).set(data);
	const dv = new DataView(bw.buffer, bw.byteOffset, 8);
	assertEquals(dv.getUint32(0), CSMAGIC_BLOBWRAPPER);
	assertEquals(dv.getUint32(4), BlobWrapper.length(bw) + 8);
	ptr = BlobWrapper.data(bw);
	assertEquals(
		new Uint8Array(ptr.buffer, ptr.byteOffset, BlobWrapper.length(bw)),
		data,
	);
});

Deno.test('alloc size', () => {
	const data = new Uint8Array(16);
	const bw = BlobWrapper.alloc(data.byteLength);
	const dv = new DataView(bw.buffer, bw.byteOffset, 8);
	assertEquals(dv.getUint32(0), CSMAGIC_BLOBWRAPPER);
	assertEquals(dv.getUint32(4), BlobWrapper.length(bw) + 8);
	const ptr = BlobWrapper.data(bw);
	assertEquals(
		new Uint8Array(ptr.buffer, ptr.byteOffset, BlobWrapper.length(bw)),
		data,
	);
});

Deno.test('alloc buffer', () => {
	const data = unhex('09 AB CD EF 01 02 03 04 05 06 07 08 09 0A 0B 0C');
	const bw = BlobWrapper.alloc(data.buffer, data.byteLength);
	const dv = new DataView(bw.buffer, bw.byteOffset, 8);
	assertEquals(dv.getUint32(0), CSMAGIC_BLOBWRAPPER);
	assertEquals(dv.getUint32(4), BlobWrapper.length(bw) + 8);
	const ptr = BlobWrapper.data(bw);
	assertEquals(
		new Uint8Array(ptr.buffer, ptr.byteOffset, BlobWrapper.length(bw)),
		data,
	);
});

Deno.test('alloc view', () => {
	const data = unhex('09 AB CD EF 01 02 03 04 05 06 07 08 09 0A 0B 0C');
	const view = new Uint8Array([1, ...data, 1]).subarray(1, -1);
	const bw = BlobWrapper.alloc(view, view.byteLength);
	const dv = new DataView(bw.buffer, bw.byteOffset, 8);
	assertEquals(dv.getUint32(0), CSMAGIC_BLOBWRAPPER);
	assertEquals(dv.getUint32(4), BlobWrapper.length(bw) + 8);
	const ptr = BlobWrapper.data(bw);
	assertEquals(
		new Uint8Array(ptr.buffer, ptr.byteOffset, BlobWrapper.length(bw)),
		data,
	);
});
