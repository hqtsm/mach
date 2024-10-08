import {describe, it} from 'node:test';
import {deepStrictEqual, strictEqual} from 'node:assert';

import {unhex} from './util.spec.ts';
import {kSecCodeMagicEntitlementDER} from './const.ts';
import {EntitlementDERBlob} from './entitlementderblob.ts';
import {cast} from './util.ts';

void describe('entitlementderblob', () => {
	void it('empty (invalid?)', () => {
		const {sizeof} = EntitlementDERBlob;
		const buffer = new ArrayBuffer(sizeof);
		const edb = new EntitlementDERBlob(buffer);
		edb.initialize2(sizeof);
		deepStrictEqual(
			new Uint8Array(buffer),
			unhex('FA DE 71 72 00 00 00 08')
		);
	});

	void it('data', () => {
		const data = unhex('01 02 03 04 05 06 07 08 F0 F1 F2 F3 F4 F5 F6 F7');
		const edb = cast(EntitlementDERBlob, EntitlementDERBlob.blobify(data));
		const dv = new DataView(edb.buffer, edb.byteOffset, edb.length);
		strictEqual(dv.getUint32(0), kSecCodeMagicEntitlementDER);
		strictEqual(dv.getUint32(4), edb.length);
		deepStrictEqual(
			new Uint8Array(edb.der.buffer, edb.der.byteOffset, edb.derLength),
			data
		);
	});
});
