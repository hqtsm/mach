import {describe, it} from 'node:test';
import {deepStrictEqual, strictEqual} from 'node:assert';

import {viewData, viewUint8} from './util.ts';
import {unhex} from './util.spec.ts';
import {kSecCodeMagicEntitlementDER} from './const.ts';
import {EntitlementDERBlob} from './entitlementderblob.ts';

void describe('entitlementderblob', () => {
	void it('empty (invalid?)', () => {
		const edb = new EntitlementDERBlob();
		edb.initialize(EntitlementDERBlob.sizeof);
		deepStrictEqual(viewUint8(edb), unhex('FA DE 71 72 00 00 00 08'));
	});

	void it('data', () => {
		const data = unhex('01 02 03 04 05 06 07 08 F0 F1 F2 F3 F4 F5 F6 F7');
		const edb = EntitlementDERBlob.blobify(data);
		const dv = viewData(edb);
		strictEqual(dv.getUint32(0), kSecCodeMagicEntitlementDER);
		strictEqual(dv.getUint32(4), edb.byteLength);
		deepStrictEqual(viewUint8(dv, 8), data);
	});
});
