import { assertEquals } from '@std/assert';
import { kSecCodeMagicLaunchConstraint } from '../const.ts';
import { unhex } from '../spec/hex.ts';
import { LaunchConstraintBlob } from './launchconstraintblob.ts';

/*
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
	<key>signing-identifier</key>
	<string>com.example.apple-samplecode.constraining-a-tools-launch-environment</string>
	<key>team-identifier</key>
	<string>B97A5CM278</string>
</dict>
</plist>
*/
const sampleDer = unhex(
	'70 81 AD 02 01 01 B0 81 A7 30 09 0C 04 63 63 61',
	'74 02 01 00 30 09 0C 04 63 6F 6D 70 02 01 01 30',
	'81 83 0C 04 72 65 71 73 B0 7B 30 5A 0C 12 73 69',
	'67 6E 69 6E 67 2D 69 64 65 6E 74 69 66 69 65 72',
	'0C 44 63 6F 6D 2E 65 78 61 6D 70 6C 65 2E 61 70',
	'70 6C 65 2D 73 61 6D 70 6C 65 63 6F 64 65 2E 63',
	'6F 6E 73 74 72 61 69 6E 69 6E 67 2D 61 2D 74 6F',
	'6F 6C 73 2D 6C 61 75 6E 63 68 2D 65 6E 76 69 72',
	'6F 6E 6D 65 6E 74 30 1D 0C 0F 74 65 61 6D 2D 69',
	'64 65 6E 74 69 66 69 65 72 0C 0A 42 39 37 41 35',
	'43 4D 32 37 38 30 09 0C 04 76 65 72 73 02 01 01',
);

Deno.test('BYTE_LENGTH', () => {
	assertEquals(LaunchConstraintBlob.BYTE_LENGTH, 8);
});

Deno.test('empty (invalid?)', () => {
	const { BYTE_LENGTH } = LaunchConstraintBlob;
	const buffer = new ArrayBuffer(BYTE_LENGTH);
	const edb = new LaunchConstraintBlob(buffer);
	edb.initialize2(BYTE_LENGTH);
	assertEquals(
		new Uint8Array(buffer),
		unhex('FA DE 81 81 00 00 00 08'),
	);
});

Deno.test('data', () => {
	const edb = new LaunchConstraintBlob(
		LaunchConstraintBlob.blobify(sampleDer),
	);
	const dv = new DataView(edb.buffer, edb.byteOffset, edb.length());
	assertEquals(dv.getUint32(0), kSecCodeMagicLaunchConstraint);
	assertEquals(dv.getUint32(4), edb.length());
	const ptr = edb.der();
	assertEquals(
		new Uint8Array(ptr.buffer, ptr.byteOffset, edb.derLength()),
		sampleDer,
	);
});
