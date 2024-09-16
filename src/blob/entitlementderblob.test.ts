import {describe, it} from 'node:test';
import {deepStrictEqual, strictEqual} from 'node:assert';

import {viewDataR, viewUint8R} from '../util.ts';
import {unhex} from '../util.spec.ts';
import {kSecCodeMagicEntitlementDER} from '../const.ts';
import {EntitlementDERBlob} from './entitlementderblob.ts';

void describe('blob/entitlementderblob', () => {
	void it('empty (invalid?)', () => {
		const edb = new EntitlementDERBlob();
		const d = new Uint8Array(edb.byteLength);
		edb.byteWrite(d);
		deepStrictEqual(d, unhex('FA DE 71 72 00 00 00 08'));

		const edb2 = new EntitlementDERBlob();
		strictEqual(edb2.byteRead(d), d.byteLength);
		deepStrictEqual(edb2, edb);
	});

	void it('data', () => {
		const data = unhex('01 02 03 04 05 06 07 08 F0 F1 F2 F3 F4 F5 F6 F7');
		const edb = new EntitlementDERBlob();
		edb.data = data;
		const d = new Uint8Array(edb.byteLength);
		edb.byteWrite(d);
		const dv = viewDataR(d);
		strictEqual(dv.getUint32(0), kSecCodeMagicEntitlementDER);
		strictEqual(dv.getUint32(4), d.byteLength);
		deepStrictEqual(viewUint8R(dv, 8), data);

		const edb2 = new EntitlementDERBlob();
		strictEqual(edb2.byteRead(d), d.byteLength);
		deepStrictEqual(edb2, edb);
	});
});
