import { assertEquals } from '@std/assert';
import { unhex } from '../util.spec.ts';
import { CSMAGIC_BLOBWRAPPER } from '../const.ts';
import { BlobWrapper } from './blobwrapper.ts';

Deno.test('BYTE_LENGTH', () => {
	assertEquals(BlobWrapper.BYTE_LENGTH, 8);
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

Deno.test('alloc data', () => {
	const data = unhex('09 AB CD EF 01 02 03 04 05 06 07 08 09 0A 0B 0C');
	const bw = BlobWrapper.alloc(data);
	const dv = new DataView(bw.buffer, bw.byteOffset, 8);
	assertEquals(dv.getUint32(0), CSMAGIC_BLOBWRAPPER);
	assertEquals(dv.getUint32(4), bw.length + 8);
	assertEquals(
		new Uint8Array(bw.data.buffer, bw.data.byteOffset, bw.length),
		data,
	);
});

Deno.test('alloc length', () => {
	const data = unhex('09 AB CD EF 01 02 03 04 05 06 07 08 09 0A 0B 0C');
	const bw = BlobWrapper.alloc(data.length);
	new Uint8Array(bw.data.buffer, bw.data.byteOffset).set(data);
	const dv = new DataView(bw.buffer, bw.byteOffset, 8);
	assertEquals(dv.getUint32(0), CSMAGIC_BLOBWRAPPER);
	assertEquals(dv.getUint32(4), bw.length + 8);
	assertEquals(
		new Uint8Array(bw.data.buffer, bw.data.byteOffset, bw.length),
		data,
	);
});
