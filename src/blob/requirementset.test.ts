import {describe, it} from 'node:test';
import {deepStrictEqual, strictEqual} from 'node:assert';

import {RequirementSet} from './requirementset.ts';
import {
	kSecDesignatedRequirementType,
	kSecHostRequirementType
} from '../const.ts';
import {Requirement} from './requirement.ts';
import {unhex} from '../util.spec.ts';

void describe('blob/requirementset', () => {
	void it('empty', () => {
		const r = new RequirementSet();
		const d = new Uint8Array(r.byteLength);
		r.byteWrite(d);
		deepStrictEqual(d, unhex('FA DE 0C 01 00 00 00 0C 00 00 00 00'));

		const rd = new RequirementSet();
		strictEqual(rd.byteRead(d), d.byteLength);
		deepStrictEqual(rd, r);
	});

	void it('host + designated', () => {
		const hostData = unhex(
			'00 00 00 01 00 00 00 02 00 00 00 0E',
			'63 6F 6D 2E 61 70 70 6C 65 2E 68 6F 73 74 00 00'
		);
		const designatedData = unhex(
			'00 00 00 01 00 00 00 02 00 00 00 14',
			'63 6F 6D 2E 61 70 70 6C 65 2E 64 65 73 69 67 6E 61 74 65 64'
		);
		const data = unhex(
			'FA DE 0C 01 00 00 00 68',
			'00 00 00 02',
			'00 00 00 01 00 00 00 1C',
			'00 00 00 03 00 00 00 40',
			'FA DE 0C 00 00 00 00 24',
			Buffer.from(hostData).toString('hex'),
			'FA DE 0C 00 00 00 00 28',
			Buffer.from(designatedData).toString('hex')
		);
		const r = new RequirementSet();
		const designated = new Requirement();
		designated.data = designatedData;
		r.setType(kSecDesignatedRequirementType, designated);
		deepStrictEqual([...r.types()], [kSecDesignatedRequirementType]);
		const host = new Requirement();
		host.data = hostData;
		r.setType(kSecHostRequirementType, host);
		deepStrictEqual(
			[...r.types()],
			[kSecHostRequirementType, kSecDesignatedRequirementType]
		);
		const d = new Uint8Array(r.byteLength);
		r.byteWrite(d);
		deepStrictEqual(d, data);

		const r2 = new RequirementSet();
		strictEqual(r2.byteRead(d), d.byteLength);
		deepStrictEqual(r2, r);
	});
});
