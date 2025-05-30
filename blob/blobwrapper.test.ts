import { assertEquals } from '@std/assert';
import { CSMAGIC_BLOBWRAPPER } from '../const.ts';
import { unhex } from '../spec/hex.ts';
import { BlobWrapper } from './blobwrapper.ts';

Deno.test('BYTE_LENGTH', () => {
	assertEquals(BlobWrapper.BYTE_LENGTH, 8);
});

Deno.test('length', () => {
	const bw = new BlobWrapper(new ArrayBuffer(BlobWrapper.BYTE_LENGTH));
	assertEquals(bw.length(), -8);
	assertEquals(bw.length(8), undefined);
	assertEquals(bw.length(), 0);
	assertEquals(bw.length(16), undefined);
	assertEquals(bw.length(), 8);
});

Deno.test('empty', () => {
	const { BYTE_LENGTH } = BlobWrapper;
	const buffer = new ArrayBuffer(BYTE_LENGTH);
	const bw = new BlobWrapper(buffer);
	bw.initialize2(BYTE_LENGTH);
	assertEquals(
		new Uint8Array(buffer),
		unhex('FA DE 0B 01 00 00 00 08'),
	);
});

Deno.test('alloc length', () => {
	const data = unhex('09 AB CD EF 01 02 03 04 05 06 07 08 09 0A 0B 0C');
	const bw = BlobWrapper.alloc(data.length);
	let ptr = bw.data();
	new Uint8Array(ptr.buffer, ptr.byteOffset).set(data);
	const dv = new DataView(bw.buffer, bw.byteOffset, 8);
	assertEquals(dv.getUint32(0), CSMAGIC_BLOBWRAPPER);
	assertEquals(dv.getUint32(4), bw.length() + 8);
	ptr = bw.data();
	assertEquals(
		new Uint8Array(ptr.buffer, ptr.byteOffset, bw.length()),
		data,
	);
});

Deno.test('alloc view', () => {
	const data = unhex('09 AB CD EF 01 02 03 04 05 06 07 08 09 0A 0B 0C');
	const bw = BlobWrapper.alloc(data.buffer);
	const dv = new DataView(bw.buffer, bw.byteOffset, 8);
	assertEquals(dv.getUint32(0), CSMAGIC_BLOBWRAPPER);
	assertEquals(dv.getUint32(4), bw.length() + 8);
	const ptr = bw.data();
	assertEquals(
		new Uint8Array(ptr.buffer, ptr.byteOffset, bw.length()),
		data,
	);
});

Deno.test('alloc view', () => {
	const data = unhex('09 AB CD EF 01 02 03 04 05 06 07 08 09 0A 0B 0C');
	const view = new Uint8Array([1, ...data, 1]).subarray(1, -1);
	const bw = BlobWrapper.alloc(view);
	const dv = new DataView(bw.buffer, bw.byteOffset, 8);
	assertEquals(dv.getUint32(0), CSMAGIC_BLOBWRAPPER);
	assertEquals(dv.getUint32(4), bw.length() + 8);
	const ptr = bw.data();
	assertEquals(
		new Uint8Array(ptr.buffer, ptr.byteOffset, bw.length()),
		data,
	);
});
