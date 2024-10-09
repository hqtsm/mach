import {describe, it} from 'node:test';
import {deepStrictEqual, strictEqual} from 'node:assert';

import {unhex} from '../util.spec.ts';

import {Requirement} from './requirement.ts';

void describe('Requirement', () => {
	void it('BYTE_LENGTH', () => {
		strictEqual(Requirement.BYTE_LENGTH, 12);
	});

	void it('empty kind 0 (invalid?)', () => {
		const {BYTE_LENGTH} = Requirement;
		const buffer = new ArrayBuffer(BYTE_LENGTH);
		const r = new Requirement(buffer);
		r.initialize2(BYTE_LENGTH);
		deepStrictEqual(
			new Uint8Array(buffer),
			unhex('FA DE 0C 00 00 00 00 0C 00 00 00 00')
		);
	});

	void it('empty kind 1 (invalid?)', () => {
		const {BYTE_LENGTH} = Requirement;
		const buffer = new ArrayBuffer(BYTE_LENGTH);
		const r = new Requirement(buffer);
		r.initialize2(BYTE_LENGTH);
		r.kind = Requirement.exprForm;
		deepStrictEqual(
			new Uint8Array(buffer),
			unhex('FA DE 0C 00 00 00 00 0C 00 00 00 01')
		);
	});

	void it('empty kind 2 (invalid?)', () => {
		const {BYTE_LENGTH} = Requirement;
		const buffer = new ArrayBuffer(BYTE_LENGTH);
		const r = new Requirement(buffer);
		r.initialize2(BYTE_LENGTH);
		r.kind = Requirement.lwcrForm;
		deepStrictEqual(
			new Uint8Array(buffer),
			unhex('FA DE 0C 00 00 00 00 0C 00 00 00 02')
		);
	});
});
