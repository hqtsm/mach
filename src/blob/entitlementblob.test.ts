void 0;

/*
import {describe, it} from 'node:test';
import {deepStrictEqual, strictEqual} from 'node:assert';

import {stringToBytes, viewDataR, viewUint8R} from '../util.ts';
import {unhex} from '../util.spec.ts';
import {kSecCodeMagicEntitlement} from '../const.ts';
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

void describe('blob/entitlementblob', () => {
	void it('empty (invalid?)', () => {
		const eb = new EntitlementBlob();
		const d = new Uint8Array(eb.byteLength);
		eb.byteWrite(d);
		deepStrictEqual(d, unhex('FA DE 71 71 00 00 00 08'));

		const eb2 = new EntitlementBlob();
		strictEqual(eb2.byteRead(d), d.byteLength);
		deepStrictEqual(eb2, eb);
	});

	void it('data', () => {
		const data = stringToBytes(examplePlist);
		const eb = new EntitlementBlob();
		eb.data = data;
		const d = new Uint8Array(eb.byteLength);
		eb.byteWrite(d);
		const dv = viewDataR(d);
		strictEqual(dv.getUint32(0), kSecCodeMagicEntitlement);
		strictEqual(dv.getUint32(4), d.byteLength);
		deepStrictEqual(viewUint8R(dv, 8), data);

		const eb2 = new EntitlementBlob();
		strictEqual(eb2.byteRead(d), d.byteLength);
		deepStrictEqual(eb2, eb);
	});
});
*/
