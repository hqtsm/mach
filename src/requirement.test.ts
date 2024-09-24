import {describe, it} from 'node:test';
import {deepStrictEqual} from 'node:assert';

import {Requirement} from './requirement.ts';
import {unhex} from './util.spec.ts';
import {subview} from './util.ts';

void describe('requirement', () => {
	void it('empty kind 0 (invalid?)', () => {
		const r = new Requirement();
		r.initialize(Requirement.sizeof);
		deepStrictEqual(
			subview(Uint8Array, r),
			unhex('FA DE 0C 00 00 00 00 0C 00 00 00 00')
		);
	});

	void it('empty kind 1 (invalid?)', () => {
		const r = new Requirement();
		r.initialize(Requirement.sizeof);
		r.kind = Requirement.Kind.exprForm;
		deepStrictEqual(
			subview(Uint8Array, r),
			unhex('FA DE 0C 00 00 00 00 0C 00 00 00 01')
		);
	});

	void it('empty kind 2 (invalid?)', () => {
		const r = new Requirement();
		r.initialize(Requirement.sizeof);
		r.kind = Requirement.Kind.lwcrForm;
		deepStrictEqual(
			subview(Uint8Array, r),
			unhex('FA DE 0C 00 00 00 00 0C 00 00 00 02')
		);
	});
});
