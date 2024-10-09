import {describe, it} from 'node:test';
import {deepStrictEqual, strictEqual} from 'node:assert';

import {unhex} from '../util.spec.ts';

import {Requirements} from './requirements.ts';

void describe('Requirements', () => {
	void it('BYTE_LENGTH', () => {
		strictEqual(Requirements.BYTE_LENGTH, 12);
	});

	void it('empty', () => {
		const {BYTE_LENGTH} = Requirements;
		const buffer = new ArrayBuffer(BYTE_LENGTH);
		const rs = new Requirements(buffer);
		rs.initialize2(BYTE_LENGTH);
		deepStrictEqual(
			new Uint8Array(buffer),
			unhex('FA DE 0C 01 00 00 00 0C 00 00 00 00')
		);
	});
});
