import {describe, it} from 'node:test';
import {deepStrictEqual, strictEqual} from 'node:assert';

import {unhex} from './util.spec.ts';
import {kSecCodeMagicEntitlement} from './const.ts';
import {EntitlementBlob} from './entitlementblob.ts';

const examplePlist = [
	'<?xml version="1.0" encoding="UTF-8"?>',
	'<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">',
	'<plist version="1.0">',
	'  <dict>',
	'    <key>com.apple.security.cs.disable-library-validation</key>',
	'    <true/>',
	'  </dict>',
	'</plist>',
	''
].join('\n');

void describe('entitlementblob', () => {
	void it('empty (invalid?)', () => {
		const {sizeof} = EntitlementBlob;
		const buffer = new ArrayBuffer(sizeof);
		const eb = new EntitlementBlob(buffer);
		eb.initialize(sizeof);
		deepStrictEqual(
			new Uint8Array(buffer),
			unhex('FA DE 71 71 00 00 00 08')
		);
	});

	void it('data', () => {
		const data = new TextEncoder().encode(examplePlist);
		const eb = EntitlementBlob.blobify(data);
		eb.body.set(data);
		const dv = new DataView(eb.buffer, eb.byteOffset, eb.byteLength);
		strictEqual(dv.getUint32(0), kSecCodeMagicEntitlement);
		strictEqual(dv.getUint32(4), eb.byteLength);
		deepStrictEqual(eb.body.subarray(0, eb.bodyLength), data);
	});
});
