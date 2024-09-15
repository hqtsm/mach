import {describe, it} from 'node:test';
import {deepStrictEqual, strictEqual} from 'node:assert';

import {viewDataR, viewUint8R} from '../util.ts';
import {unhex} from '../util.spec.ts';
import {Unknown} from './unknown.ts';

void describe('blob/unknown', () => {
	void it('empty', () => {
		const r = new Unknown();
		const d = new Uint8Array(r.byteLength);
		r.byteWrite(d);
		deepStrictEqual(d, unhex('00 00 00 00 00 00 00 08'));

		const rd = new Unknown();
		strictEqual(rd.byteRead(d), d.byteLength);
		deepStrictEqual(rd, r);
	});

	void it('data', () => {
		const magic = 0x12345678;
		const data = unhex('09 AB CD EF 01 02 03 04 05 06 07 08 09 0A 0B 0C');
		const r = new Unknown();
		r.magic = magic;
		r.data = data;
		const d = new Uint8Array(r.byteLength);
		r.byteWrite(d);
		const dv = viewDataR(d);
		strictEqual(dv.getUint32(0), magic);
		strictEqual(dv.getUint32(4), d.byteLength);
		deepStrictEqual(viewUint8R(dv, 8), data);

		const r2 = new Unknown();
		strictEqual(r2.byteRead(d), d.byteLength);
		deepStrictEqual(r2, r);
	});
});
