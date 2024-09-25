import {describe, it} from 'node:test';
import {deepStrictEqual, strictEqual} from 'node:assert';

import {subview} from './util.ts';
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
		const eb = new EntitlementBlob(new ArrayBuffer(sizeof));
		eb.initialize(sizeof);
		deepStrictEqual(
			subview(Uint8Array, eb),
			unhex('FA DE 71 71 00 00 00 08')
		);
	});

	void it('data', () => {
		const data = new TextEncoder().encode(examplePlist);
		const eb = EntitlementBlob.blobify(data);
		eb.body.set(data);
		const dv = subview(DataView, eb);
		strictEqual(dv.getUint32(0), kSecCodeMagicEntitlement);
		strictEqual(dv.getUint32(4), eb.byteLength);
		deepStrictEqual(subview(Uint8Array, dv, 8), data);
	});
});
