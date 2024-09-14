import {describe, it} from 'node:test';
import {deepStrictEqual, strictEqual} from 'node:assert';

import {Requirement} from './requirement.ts';
import {viewDataR, viewUint8R} from '../util.ts';
import {kSecCodeMagicRequirement} from '../const.ts';

void describe('blob/requirement', () => {
	void it('empty (invalid?)', () => {
		const r = new Requirement();
		const d = new Uint8Array(r.byteLength);
		r.byteWrite(d);
		deepStrictEqual(
			d,
			new Uint8Array(
				Buffer.from(
					'FA DE 0C 00 00 00 00 08'.replaceAll(' ', ''),
					'hex'
				)
			)
		);

		const rd = new Requirement();
		strictEqual(rd.byteRead(d), d.byteLength);
		deepStrictEqual(rd, r);
	});

	void it('identifier "com.apple.simple"', () => {
		const data = viewUint8R(
			Buffer.from(
				[
					'00 00 00 01',
					'00 00 00 02',
					'00 00 00 10',
					'63 6F 6D 2E 61 70 70 6C 65 2E 73 69 6D 70 6C 65'
				]
					.join(' ')
					.replaceAll(' ', ''),
				'hex'
			)
		);
		const r = new Requirement();
		r.data = data;
		const d = new Uint8Array(r.byteLength);
		r.byteWrite(d);
		const dv = viewDataR(d);
		strictEqual(dv.getUint32(0), kSecCodeMagicRequirement);
		strictEqual(dv.getUint32(4), d.byteLength);
		deepStrictEqual(viewUint8R(dv, 8), viewUint8R(data));

		const rd = new Requirement();
		strictEqual(rd.byteRead(d), d.byteLength);
		deepStrictEqual(rd, r);
	});
});
