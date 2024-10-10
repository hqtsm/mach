import {describe, it} from 'node:test';
import {deepStrictEqual} from 'node:assert';

import {
	kSecDesignatedRequirementType,
	kSecHostRequirementType
} from '../const.ts';
import {unhex} from '../util.spec.ts';

import {Requirement} from './requirement.ts';
import {RequirementsMaker} from './requirementsmaker.ts';

void describe('RequirementsMaker', () => {
	void it('empty', () => {
		const rs = new RequirementsMaker().make();
		deepStrictEqual(
			new Uint8Array(rs.buffer, rs.byteOffset, rs.length),
			unhex('FA DE 0C 01 00 00 00 0C 00 00 00 00')
		);
	});

	void it('host + designated', () => {
		// host => anchor apple and identifier com.apple.host
		const host = unhex(
			'00 00 00 01 00 00 00 02 00 00 00 0E',
			'63 6F 6D 2E 61 70 70 6C 65 2E 68 6F 73 74 00 00'
		);
		// designated => anchor apple and identifier com.apple.designated
		const designated = unhex(
			'00 00 00 01 00 00 00 02 00 00 00 14',
			'63 6F 6D 2E 61 70 70 6C 65 2E 64 65 73 69 67 6E 61 74 65 64'
		);
		const data = unhex(
			'FA DE 0C 01 00 00 00 68',
			'00 00 00 02',
			'00 00 00 01 00 00 00 1C',
			'00 00 00 03 00 00 00 40',
			'FA DE 0C 00 00 00 00 24',
			Buffer.from(host).toString('hex'),
			'FA DE 0C 00 00 00 00 28',
			Buffer.from(designated).toString('hex')
		);
		const rsm = new RequirementsMaker();
		rsm.add(
			kSecHostRequirementType,
			new Requirement(Requirement.blobify(host).buffer)
		);
		rsm.add(
			kSecDesignatedRequirementType,
			new Requirement(Requirement.blobify(designated).buffer)
		);
		const rs = rsm.make();
		deepStrictEqual(
			new Uint8Array(rs.buffer, rs.byteOffset, rs.length),
			data
		);
	});
});
