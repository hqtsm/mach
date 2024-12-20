import { assertEquals } from '@std/assert';
import { unhex } from '../util.spec.ts';
import { kSecCodeMagicEntitlement } from '../const.ts';
import { EntitlementBlob } from './entitlementblob.ts';

const examplePlist = [
	'<?xml version="1.0" encoding="UTF-8"?>',
	'<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">',
	'<plist version="1.0">',
	'  <dict>',
	'    <key>com.apple.security.cs.disable-library-validation</key>',
	'    <true/>',
	'  </dict>',
	'</plist>',
	'',
].join('\n');

Deno.test('BYTE_LENGTH', () => {
	assertEquals(EntitlementBlob.BYTE_LENGTH, 8);
});

Deno.test('empty (invalid?)', () => {
	const { BYTE_LENGTH } = EntitlementBlob;
	const buffer = new ArrayBuffer(BYTE_LENGTH);
	const eb = new EntitlementBlob(buffer);
	eb.initialize2(BYTE_LENGTH);
	assertEquals(
		new Uint8Array(buffer),
		unhex('FA DE 71 71 00 00 00 08'),
	);
});

Deno.test('data', () => {
	const data = new TextEncoder().encode(examplePlist);
	const eb = new EntitlementBlob(EntitlementBlob.blobify(data).buffer);
	eb.body.set(data);
	const dv = new DataView(eb.buffer, eb.byteOffset, eb.length);
	assertEquals(dv.getUint32(0), kSecCodeMagicEntitlement);
	assertEquals(dv.getUint32(4), eb.length);
	assertEquals(
		new Uint8Array(eb.body.buffer, eb.body.byteOffset, eb.bodyLength),
		data,
	);
});
