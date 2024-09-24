import {describe, it} from 'node:test';
import {deepStrictEqual} from 'node:assert';

import {Requirements} from './requirements.ts';
import {unhex} from './util.spec.ts';
import {viewUint8} from './util.ts';

void describe('requirements', () => {
	void it('empty', () => {
		const rs = new Requirements();
		rs.initialize(Requirements.sizeof);
		deepStrictEqual(
			viewUint8(rs),
			unhex('FA DE 0C 01 00 00 00 0C 00 00 00 00')
		);
	});
});
