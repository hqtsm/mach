import {describe, it} from 'node:test';
import {deepStrictEqual, strictEqual} from 'node:assert';

import {unhex} from '../util.spec.ts';

import {Requirement} from './requirement.ts';

void describe('requirement', () => {
	void it('sizeof', () => {
		strictEqual(Requirement.sizeof, 12);
	});

	void it('empty kind 0 (invalid?)', () => {
		const {sizeof} = Requirement;
		const buffer = new ArrayBuffer(sizeof);
		const r = new Requirement(buffer);
		r.initialize2(sizeof);
		deepStrictEqual(
			new Uint8Array(buffer),
			unhex('FA DE 0C 00 00 00 00 0C 00 00 00 00')
		);
	});

	void it('empty kind 1 (invalid?)', () => {
		const {sizeof} = Requirement;
		const buffer = new ArrayBuffer(sizeof);
		const r = new Requirement(buffer);
		r.initialize2(sizeof);
		r.kind = Requirement.exprForm;
		deepStrictEqual(
			new Uint8Array(buffer),
			unhex('FA DE 0C 00 00 00 00 0C 00 00 00 01')
		);
	});

	void it('empty kind 2 (invalid?)', () => {
		const {sizeof} = Requirement;
		const buffer = new ArrayBuffer(sizeof);
		const r = new Requirement(buffer);
		r.initialize2(sizeof);
		r.kind = Requirement.lwcrForm;
		deepStrictEqual(
			new Uint8Array(buffer),
			unhex('FA DE 0C 00 00 00 00 0C 00 00 00 02')
		);
	});
});
