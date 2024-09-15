import {describe, it} from 'node:test';
import {deepStrictEqual, strictEqual} from 'node:assert';

import {viewDataR, viewUint8R} from '../util.ts';
import {unhex} from '../util.spec.ts';
import {CSMAGIC_BLOBWRAPPER} from '../const.ts';
import {BlobWrapper} from './blobwrapper.ts';

void describe('blob/blobwrapper', () => {
	void it('empty', () => {
		const r = new BlobWrapper();
		const d = new Uint8Array(r.byteLength);
		r.byteWrite(d);
		deepStrictEqual(d, unhex('FA DE 0B 01 00 00 00 08'));

		const rd = new BlobWrapper();
		strictEqual(rd.byteRead(d), d.byteLength);
		deepStrictEqual(rd, r);
	});

	void it('data', () => {
		const data = unhex('09 AB CD EF 01 02 03 04 05 06 07 08 09 0A 0B 0C');
		const r = new BlobWrapper();
		r.data = data;
		const d = new Uint8Array(r.byteLength);
		r.byteWrite(d);
		const dv = viewDataR(d);
		strictEqual(dv.getUint32(0), CSMAGIC_BLOBWRAPPER);
		strictEqual(dv.getUint32(4), d.byteLength);
		deepStrictEqual(viewUint8R(dv, 8), data);

		const r2 = new BlobWrapper();
		strictEqual(r2.byteRead(d), d.byteLength);
		deepStrictEqual(r2, r);
	});
});
