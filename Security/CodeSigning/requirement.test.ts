import { assertEquals, assertStrictEquals } from '@std/assert';
import { PLData, PLDate, PLDictionary } from '@hqtsm/plist';
import {
	CS_SHA256_LEN,
	CS_VALIDATION_CATEGORY_INVALID,
	CS_VALIDATION_CATEGORY_PLATFORM,
} from '../../kern/cs_blobs.ts';
import { PLATFORM_MACOS } from '../../mach-o/loader.ts';
import { __SecCertificate } from '../../sec/SecCertificate.ts';
import { unhex } from '../../spec/hex.ts';
import {
	kSecCodeSignatureHashSHA256,
	kSecDesignatedRequirementType,
	kSecHostRequirementType,
} from '../CSCommon.ts';
import { CodeDirectory } from './codedirectory.ts';
import {
	Requirement,
	Requirement_Context,
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

Deno.test('Requirements_Maker: empty', () => {
	const rs = Requirements_Maker.make(new Requirements_Maker());
	assertEquals(
		new Uint8Array(rs.buffer, rs.byteOffset, Requirements.size(rs)),
		unhex('FA DE 0C 01 00 00 00 0C 00 00 00 00'),
	);
});

Deno.test('Requirements_Maker: host + designated', () => {
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
		new Requirement(Requirement.blobify(host).buffer),
	);
	Requirements_Maker.add(
		rsm,
		kSecDesignatedRequirementType,
		new Requirement(Requirement.blobify(designated).buffer),
	);
	const rs = Requirements_Maker.make(rsm);
	assertEquals(
		new Uint8Array(rs.buffer, rs.byteOffset, Requirements.size(rs)),
		data,
	);
});

Deno.test('Requirement_Context', () => {
	const certs = [
		new __SecCertificate(),
		new __SecCertificate(),
		new __SecCertificate(),
	];
	const infoDict = new PLDictionary();
	const entitlementDict = new PLDictionary();
	const ident = new TextEncoder().encode('Identifier').buffer;
	const dir = new CodeDirectory(new ArrayBuffer(CodeDirectory.BYTE_LENGTH));
	const packageChecksum = new PLData(CS_SHA256_LEN);
	const secureTimestamp = new PLDate();
	const teamID = new TextEncoder().encode('TeamID');

	const ctxNone = new Requirement_Context();
	assertEquals(ctxNone.certs, null);
	assertEquals(ctxNone.info, null);
	assertEquals(ctxNone.entitlements, null);
	assertEquals(ctxNone.identifier.byteLength, 0);
	assertEquals(ctxNone.directory, null);
	assertEquals(ctxNone.packageChecksum, null);
	assertEquals(ctxNone.packageAlgorithm, 0);
	assertEquals(ctxNone.forcePlatform, false);
	assertEquals(ctxNone.secureTimestamp, null);
	assertEquals(ctxNone.teamIdentifier, null);
	assertEquals(ctxNone.platformType, 0);
	assertEquals(ctxNone.isSIPProtected, false);
	assertEquals(ctxNone.onAuthorizedAuthAPFSVolume, false);
	assertEquals(ctxNone.onSystemVolume, false);
	assertEquals(ctxNone.validationCategory, 0);
	assertEquals(Requirement_Context.certCount(ctxNone), 0);
	assertEquals(Requirement_Context.cert(ctxNone, 0), null);

	const ctxPart = new Requirement_Context(
		certs,
		infoDict,
		entitlementDict,
		ident,
		dir,
		packageChecksum,
		kSecCodeSignatureHashSHA256,
		true,
		secureTimestamp,
		teamID,
	);
	assertStrictEquals(ctxPart.certs, certs);
	assertStrictEquals(ctxPart.info, infoDict);
	assertStrictEquals(ctxPart.entitlements, entitlementDict);
	assertStrictEquals(ctxPart.identifier.byteLength, ident.byteLength);
	assertStrictEquals(ctxPart.directory, dir);
	assertStrictEquals(ctxPart.packageChecksum, packageChecksum);
	assertEquals(ctxPart.packageAlgorithm, kSecCodeSignatureHashSHA256);
	assertEquals(ctxPart.forcePlatform, true);
	assertStrictEquals(ctxPart.secureTimestamp, secureTimestamp);
	assertStrictEquals(ctxPart.teamIdentifier, teamID);
	assertEquals(ctxPart.platformType, 0);
	assertEquals(ctxPart.isSIPProtected, false);
	assertEquals(ctxPart.onAuthorizedAuthAPFSVolume, false);
	assertEquals(ctxPart.onSystemVolume, false);
	assertEquals(ctxPart.validationCategory, CS_VALIDATION_CATEGORY_INVALID);
	assertEquals(Requirement_Context.certCount(ctxPart), 3);
	assertEquals(Requirement_Context.cert(ctxPart, 0), certs[0]);
	assertEquals(Requirement_Context.cert(ctxPart, 1), certs[1]);
	assertEquals(Requirement_Context.cert(ctxPart, 2), certs[2]);
	assertEquals(Requirement_Context.cert(ctxPart, 3), null);
	assertEquals(Requirement_Context.cert(ctxPart, -1), certs[2]);
	assertEquals(Requirement_Context.cert(ctxPart, -2), certs[1]);
	assertEquals(Requirement_Context.cert(ctxPart, -3), certs[0]);
	assertEquals(Requirement_Context.cert(ctxPart, -4), null);

	const ctxFull = new Requirement_Context(
		certs,
		infoDict,
		entitlementDict,
		ident,
		dir,
		packageChecksum,
		kSecCodeSignatureHashSHA256,
		true,
		secureTimestamp,
		teamID,
		PLATFORM_MACOS,
		true,
		true,
		true,
		CS_VALIDATION_CATEGORY_PLATFORM,
	);
	assertEquals(ctxFull.platformType, PLATFORM_MACOS);
	assertEquals(ctxFull.isSIPProtected, true);
	assertEquals(ctxFull.onAuthorizedAuthAPFSVolume, true);
	assertEquals(ctxFull.onSystemVolume, true);
	assertEquals(ctxFull.validationCategory, CS_VALIDATION_CATEGORY_PLATFORM);
});
