import {describe, it} from 'node:test';
import {deepStrictEqual, strictEqual} from 'node:assert';

import {viewDataR, viewUint8R} from '../util.ts';
import {unhex} from '../util.spec.ts';
import {UnknownBlob} from './unknownblob.ts';

void describe('blob/unknown', () => {
	void it('empty', () => {
		const ub = new UnknownBlob();
		const d = new Uint8Array(ub.byteLength);
		ub.byteWrite(d);
		deepStrictEqual(d, unhex('00 00 00 00 00 00 00 08'));

		const ub2 = new UnknownBlob();
		strictEqual(ub2.byteRead(d), d.byteLength);
		deepStrictEqual(ub2, ub);
	});

	void it('data', () => {
		const magic = 0x12345678;
		const data = unhex('09 AB CD EF 01 02 03 04 05 06 07 08 09 0A 0B 0C');
		const ub = new UnknownBlob();
		ub.magic = magic;
		ub.data = data;
		const d = new Uint8Array(ub.byteLength);
		ub.byteWrite(d);
		const dv = viewDataR(d);
		strictEqual(dv.getUint32(0), magic);
		strictEqual(dv.getUint32(4), d.byteLength);
		deepStrictEqual(viewUint8R(dv, 8), data);

		const ub2 = new UnknownBlob();
		strictEqual(ub2.byteRead(d), d.byteLength);
		deepStrictEqual(ub2, ub);
	});
});
