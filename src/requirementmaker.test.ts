import {describe, it} from 'node:test';
import {deepStrictEqual, strictEqual} from 'node:assert';

import {Requirement} from './requirement.ts';
import {viewDataR, viewUint8R} from './util.ts';
import {kSecCodeMagicRequirement} from './const.ts';
import {unhex} from './util.spec.ts';
import {RequirementMaker} from './requirementmaker.ts';

void describe('requirementmaker', () => {
	void it('identifier "com.apple.simple"', () => {
		const data = unhex(
			'00 00 00 02',
			'00 00 00 10',
			'63 6F 6D 2E 61 70 70 6C 65 2E 73 69 6D 70 6C 65'
		);
		const rm = new RequirementMaker(Requirement.Kind.exprForm);
		const add = rm.alloc(data.byteLength);
		add.set(data);
		const r = rm.make();
		const d = new Uint8Array(r.byteLength);
		r.byteWrite(d);
		const dv = viewDataR(d);
		strictEqual(dv.getUint32(0), kSecCodeMagicRequirement);
		strictEqual(dv.getUint32(4), d.byteLength);
		strictEqual(dv.getUint32(8), Requirement.Kind.exprForm);
		deepStrictEqual(viewUint8R(dv, 12), data);

		const r2 = new Requirement();
		strictEqual(r2.byteRead(d), d.byteLength);
		deepStrictEqual(r2, r);
	});
});
