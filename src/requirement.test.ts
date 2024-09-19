import {describe, it} from 'node:test';
import {deepStrictEqual, strictEqual} from 'node:assert';

import {Requirement} from './requirement.ts';
import {unhex} from './util.spec.ts';

void describe('requirement', () => {
	void it('empty (invalid?)', () => {
		const r = new Requirement();
		r.initialize(Requirement.sizeof);
		const d = new Uint8Array(r.byteLength);
		r.byteWrite(d);
		deepStrictEqual(d, unhex('FA DE 0C 00 00 00 00 0C 00 00 00 00'));

		const rd = new Requirement();
		strictEqual(rd.byteRead(d), d.byteLength);
		deepStrictEqual(rd, r);
	});
});
