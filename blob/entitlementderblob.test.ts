import { assertEquals } from '@std/assert';
import { kSecCodeMagicEntitlementDER } from '../const.ts';
import { unhex } from '../spec/hex.ts';
import { EntitlementDERBlob } from './entitlementderblob.ts';

Deno.test('BYTE_LENGTH', () => {
	assertEquals(EntitlementDERBlob.BYTE_LENGTH, 8);
});

Deno.test('empty (invalid?)', () => {
	const { BYTE_LENGTH } = EntitlementDERBlob;
	const buffer = new ArrayBuffer(BYTE_LENGTH);
	const edb = new EntitlementDERBlob(buffer);
	EntitlementDERBlob.initializeLength(edb, BYTE_LENGTH);
	assertEquals(
		new Uint8Array(buffer),
		unhex('FA DE 71 72 00 00 00 08'),
	);
});

Deno.test('data', () => {
	const data = unhex('01 02 03 04 05 06 07 08 F0 F1 F2 F3 F4 F5 F6 F7');
	const edb = new EntitlementDERBlob(EntitlementDERBlob.blobify(data));
	const dv = new DataView(
		edb.buffer,
		edb.byteOffset,
		EntitlementDERBlob.size(edb),
	);
	assertEquals(dv.getUint32(0), kSecCodeMagicEntitlementDER);
	assertEquals(dv.getUint32(4), EntitlementDERBlob.size(edb));
	const ptr = edb.der();
	assertEquals(
		new Uint8Array(ptr.buffer, ptr.byteOffset, edb.derLength()),
		data,
	);
});
