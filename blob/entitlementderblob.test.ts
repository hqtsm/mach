import { assertEquals } from '@std/assert';

import { unhex } from '../util.spec.ts';
import { kSecCodeMagicEntitlementDER } from '../const.ts';

import { EntitlementDERBlob } from './entitlementderblob.ts';

Deno.test('BYTE_LENGTH', () => {
	assertEquals(EntitlementDERBlob.BYTE_LENGTH, 8);
});

Deno.test('empty (invalid?)', () => {
	const { BYTE_LENGTH } = EntitlementDERBlob;
	const buffer = new ArrayBuffer(BYTE_LENGTH);
	const edb = new EntitlementDERBlob(buffer);
	edb.initialize2(BYTE_LENGTH);
	assertEquals(
		new Uint8Array(buffer),
		unhex('FA DE 71 72 00 00 00 08'),
	);
});

Deno.test('data', () => {
	const data = unhex('01 02 03 04 05 06 07 08 F0 F1 F2 F3 F4 F5 F6 F7');
	const edb = new EntitlementDERBlob(
		EntitlementDERBlob.blobify(data).buffer,
	);
	const dv = new DataView(edb.buffer, edb.byteOffset, edb.length);
	assertEquals(dv.getUint32(0), kSecCodeMagicEntitlementDER);
	assertEquals(dv.getUint32(4), edb.length);
	assertEquals(
		new Uint8Array(edb.der.buffer, edb.der.byteOffset, edb.derLength),
		data,
	);
});
