void 0;

/*
import {describe, it} from 'node:test';
import {deepStrictEqual, strictEqual} from 'node:assert';

import {viewDataR, viewUint8R} from '../util.ts';
import {unhex} from '../util.spec.ts';
import {CSMAGIC_BLOBWRAPPER} from '../const.ts';
import {BlobWrapper} from './blobwrapper.ts';

void describe('blob/blobwrapper', () => {
	void it('empty', () => {
		const bw = new BlobWrapper();
		const d = new Uint8Array(bw.byteLength);
		bw.byteWrite(d);
		deepStrictEqual(d, unhex('FA DE 0B 01 00 00 00 08'));

		const bw2 = new BlobWrapper();
		strictEqual(bw2.byteRead(d), d.byteLength);
		deepStrictEqual(bw2, bw);
	});

	void it('data', () => {
		const data = unhex('09 AB CD EF 01 02 03 04 05 06 07 08 09 0A 0B 0C');
		const bw = new BlobWrapper();
		bw.data = data;
		const d = new Uint8Array(bw.byteLength);
		bw.byteWrite(d);
		const dv = viewDataR(d);
		strictEqual(dv.getUint32(0), CSMAGIC_BLOBWRAPPER);
		strictEqual(dv.getUint32(4), d.byteLength);
		deepStrictEqual(viewUint8R(dv, 8), data);

		const bw2 = new BlobWrapper();
		strictEqual(bw2.byteRead(d), d.byteLength);
		deepStrictEqual(bw2, bw);
	});
});
*/
