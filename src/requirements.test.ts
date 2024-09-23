import {describe, it} from 'node:test';
import {deepStrictEqual, strictEqual} from 'node:assert';

import {Requirements} from './requirements.ts';
import {unhex} from './util.spec.ts';

void describe('requirements', () => {
	void it('empty', () => {
		const rs = new Requirements();
		rs.initialize(Requirements.sizeof);
		const d = new Uint8Array(rs.byteLength);
		rs.byteWrite(d);
		deepStrictEqual(d, unhex('FA DE 0C 01 00 00 00 0C 00 00 00 00'));

		const rs2 = new Requirements();
		strictEqual(rs2.byteRead(d), d.byteLength);
		deepStrictEqual(rs2, rs);
		strictEqual(rs2.count, 0);
	});
});
