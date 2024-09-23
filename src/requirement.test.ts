import {describe, it} from 'node:test';
import {deepStrictEqual, strictEqual} from 'node:assert';

import {Requirement} from './requirement.ts';
import {unhex} from './util.spec.ts';

void describe('requirement', () => {
	void it('empty kind 0 (invalid?)', () => {
		const r = new Requirement();
		r.initialize(Requirement.sizeof);
		const d = new Uint8Array(r.byteLength);
		r.byteWrite(d);
		deepStrictEqual(d, unhex('FA DE 0C 00 00 00 00 0C 00 00 00 00'));

		const r2 = new Requirement();
		strictEqual(r2.byteRead(d), d.byteLength);
		deepStrictEqual(r2, r);
		strictEqual(r2.kind, 0);
	});

	void it('empty kind 1 (invalid?)', () => {
		const r = new Requirement();
		r.initialize(Requirement.sizeof);
		r.kind = Requirement.Kind.exprForm;
		const d = new Uint8Array(r.byteLength);
		r.byteWrite(d);
		deepStrictEqual(d, unhex('FA DE 0C 00 00 00 00 0C 00 00 00 01'));

		const r2 = new Requirement();
		strictEqual(r2.byteRead(d), d.byteLength);
		deepStrictEqual(r2, r);
		strictEqual(r2.kind, Requirement.Kind.exprForm);
	});

	void it('empty kind 2 (invalid?)', () => {
		const r = new Requirement();
		r.initialize(Requirement.sizeof);
		r.kind = Requirement.Kind.lwcrForm;
		const d = new Uint8Array(r.byteLength);
		r.byteWrite(d);
		deepStrictEqual(d, unhex('FA DE 0C 00 00 00 00 0C 00 00 00 02'));

		const r2 = new Requirement();
		strictEqual(r2.byteRead(d), d.byteLength);
		deepStrictEqual(r2, r);
		strictEqual(r2.kind, Requirement.Kind.lwcrForm);
	});
});
