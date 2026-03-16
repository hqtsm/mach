import { assertEquals } from '@std/assert';
import {
	kSecDesignatedRequirementType,
	kSecHostRequirementType,
} from '../const.ts';
import { unhex } from '../spec/hex.ts';
import { Requirement } from './requirement.ts';
import { RequirementsMaker } from './requirementsmaker.ts';
import { Requirements } from './requirements.ts';

Deno.test('empty', () => {
	const rs = RequirementsMaker.make(new RequirementsMaker());
	assertEquals(
		new Uint8Array(rs.buffer, rs.byteOffset, Requirements.size(rs)),
		unhex('FA DE 0C 01 00 00 00 0C 00 00 00 00'),
	);
});

Deno.test('host + designated', () => {
	// host => anchor apple and identifier com.apple.host
	const host = unhex(
		'00 00 00 01 00 00 00 02 00 00 00 0E',
		'63 6F 6D 2E 61 70 70 6C 65 2E 68 6F 73 74 00 00',
	);
	// designated => anchor apple and identifier com.apple.designated
	const designated = unhex(
		'00 00 00 01 00 00 00 02 00 00 00 14',
		'63 6F 6D 2E 61 70 70 6C 65 2E 64 65 73 69 67 6E 61 74 65 64',
	);
	const data = new Uint8Array([
		...unhex(
			'FA DE 0C 01 00 00 00 68',
			'00 00 00 02',
			'00 00 00 01 00 00 00 1C',
			'00 00 00 03 00 00 00 40',
			'FA DE 0C 00 00 00 00 24',
		),
		...host,
		...unhex('FA DE 0C 00 00 00 00 28'),
		...designated,
	]);
	const rsm = new RequirementsMaker();
	RequirementsMaker.add(
		rsm,
		kSecHostRequirementType,
		new Requirement(Requirement.blobify(host)),
	);
	RequirementsMaker.add(
		rsm,
		kSecDesignatedRequirementType,
		new Requirement(Requirement.blobify(designated)),
	);
	const rs = RequirementsMaker.make(rsm);
	assertEquals(
		new Uint8Array(rs.buffer, rs.byteOffset, Requirements.size(rs)),
		data,
	);
});
