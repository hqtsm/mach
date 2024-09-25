import {describe, it} from 'node:test';
import {deepStrictEqual} from 'node:assert';

import {Requirement} from './requirement.ts';
import {unhex} from './util.spec.ts';

void describe('requirement', () => {
	void it('empty kind 0 (invalid?)', () => {
		const {sizeof} = Requirement;
		const buffer = new ArrayBuffer(sizeof);
		const r = new Requirement(buffer);
		r.initialize(sizeof);
		deepStrictEqual(
			new Uint8Array(buffer),
			unhex('FA DE 0C 00 00 00 00 0C 00 00 00 00')
		);
	});

	void it('empty kind 1 (invalid?)', () => {
		const {sizeof} = Requirement;
		const buffer = new ArrayBuffer(sizeof);
		const r = new Requirement(buffer);
		r.initialize(sizeof);
		r.kind = Requirement.Kind.exprForm;
		deepStrictEqual(
			new Uint8Array(buffer),
			unhex('FA DE 0C 00 00 00 00 0C 00 00 00 01')
		);
	});

	void it('empty kind 2 (invalid?)', () => {
		const {sizeof} = Requirement;
		const buffer = new ArrayBuffer(sizeof);
		const r = new Requirement(buffer);
		r.initialize(sizeof);
		r.kind = Requirement.Kind.lwcrForm;
		deepStrictEqual(
			new Uint8Array(buffer),
			unhex('FA DE 0C 00 00 00 00 0C 00 00 00 02')
		);
	});
});
