import { assertEquals } from '@std/assert';
import { unhex } from '../../spec/hex.ts';
import {
	kSecDesignatedRequirementType,
	kSecHostRequirementType,
} from '../CSCommon.ts';
import {
	Requirement,
	Requirements,
	Requirements_Maker,
} from './requirement.ts';

Deno.test('Requirement: BYTE_LENGTH', () => {
	assertEquals(Requirement.BYTE_LENGTH, 12);
});

Deno.test('Requirement: empty kind 0 (invalid?)', () => {
	const { BYTE_LENGTH } = Requirement;
	const buffer = new ArrayBuffer(BYTE_LENGTH);
	const r = new Requirement(buffer);
	Requirement.initializeSize(r, BYTE_LENGTH);
	assertEquals(
		new Uint8Array(buffer),
		unhex('FA DE 0C 00 00 00 00 0C 00 00 00 00'),
	);
});

Deno.test('Requirement: empty kind 1 (invalid?)', () => {
	const { BYTE_LENGTH } = Requirement;
	const buffer = new ArrayBuffer(BYTE_LENGTH);
	const r = new Requirement(buffer);
	Requirement.initializeSize(r, BYTE_LENGTH);
	Requirement.kind(r, Requirement.exprForm);
	assertEquals(
		new Uint8Array(buffer),
		unhex('FA DE 0C 00 00 00 00 0C 00 00 00 01'),
	);
});

Deno.test('Requirement: empty kind 2 (invalid?)', () => {
	const { BYTE_LENGTH } = Requirement;
	const buffer = new ArrayBuffer(BYTE_LENGTH);
	const r = new Requirement(buffer);
	Requirement.initializeSize(r, BYTE_LENGTH);
	Requirement.kind(r, Requirement.lwcrForm);
	assertEquals(
		new Uint8Array(buffer),
		unhex('FA DE 0C 00 00 00 00 0C 00 00 00 02'),
	);
});

Deno.test('Requirements: BYTE_LENGTH', () => {
	assertEquals(Requirements.BYTE_LENGTH, 12);
});

Deno.test('Requirements: empty', () => {
	const { BYTE_LENGTH } = Requirements;
	const buffer = new ArrayBuffer(BYTE_LENGTH);
	const rs = new Requirements(buffer);
	Requirements.initializeSize(rs, BYTE_LENGTH);
	assertEquals(
		new Uint8Array(buffer),
		unhex('FA DE 0C 01 00 00 00 0C 00 00 00 00'),
	);
});

Deno.test('RequirementsMaker: empty', () => {
	const rs = Requirements_Maker.make(new Requirements_Maker());
	assertEquals(
		new Uint8Array(rs.buffer, rs.byteOffset, Requirements.size(rs)),
		unhex('FA DE 0C 01 00 00 00 0C 00 00 00 00'),
	);
});

Deno.test('RequirementsMaker: host + designated', () => {
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
	const rsm = new Requirements_Maker();
	Requirements_Maker.add(
		rsm,
		kSecHostRequirementType,
		new Requirement(Requirement.blobify(host)),
	);
	Requirements_Maker.add(
		rsm,
		kSecDesignatedRequirementType,
		new Requirement(Requirement.blobify(designated)),
	);
	const rs = Requirements_Maker.make(rsm);
	assertEquals(
		new Uint8Array(rs.buffer, rs.byteOffset, Requirements.size(rs)),
		data,
	);
});
