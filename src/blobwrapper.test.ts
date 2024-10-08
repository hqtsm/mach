import {describe, it} from 'node:test';
import {deepStrictEqual, strictEqual} from 'node:assert';

import {unhex} from './util.spec.ts';
import {CSMAGIC_BLOBWRAPPER} from './const.ts';
import {BlobWrapper} from './blobwrapper.ts';
import {cast} from './util.ts';

void describe('blobwrapper', () => {
	void it('empty', () => {
		const {sizeof} = BlobWrapper;
		const buffer = new ArrayBuffer(sizeof);
		const bw = new BlobWrapper(buffer);
		bw.initialize2(sizeof);
		deepStrictEqual(
			new Uint8Array(buffer),
			unhex('FA DE 0B 01 00 00 00 08')
		);
	});

	void it('data', () => {
		const data = unhex('09 AB CD EF 01 02 03 04 05 06 07 08 09 0A 0B 0C');
		const bw = cast(BlobWrapper, BlobWrapper.blobify(data));
		const dv = new DataView(bw.buffer, bw.byteOffset, 8);
		strictEqual(dv.getUint32(0), CSMAGIC_BLOBWRAPPER);
		strictEqual(dv.getUint32(4), bw.length + 8);
		deepStrictEqual(
			new Uint8Array(bw.data.buffer, bw.data.byteOffset, bw.length),
			data
		);
	});

	void it('data', () => {
		const data = unhex('09 AB CD EF 01 02 03 04 05 06 07 08 09 0A 0B 0C');
		const bw = BlobWrapper.alloc(data.length);
		new Uint8Array(
			bw.data.buffer,
			bw.data.byteOffset,
			bw.data.byteLength
		).set(data);
		const dv = new DataView(bw.buffer, bw.byteOffset, 8);
		strictEqual(dv.getUint32(0), CSMAGIC_BLOBWRAPPER);
		strictEqual(dv.getUint32(4), bw.length + 8);
		deepStrictEqual(
			new Uint8Array(bw.data.buffer, bw.data.byteOffset, bw.length),
			data
		);
	});
});
