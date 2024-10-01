import {describe, it} from 'node:test';
import {deepStrictEqual} from 'node:assert';

import {Requirements} from './requirements.ts';
import {unhex} from './util.spec.ts';

void describe('requirements', () => {
	void it('empty', () => {
		const {sizeof} = Requirements;
		const buffer = new ArrayBuffer(sizeof);
		const rs = new Requirements(buffer);
		rs.initialize2(sizeof);
		deepStrictEqual(
			new Uint8Array(buffer),
			unhex('FA DE 0C 01 00 00 00 0C 00 00 00 00')
		);
	});
});
