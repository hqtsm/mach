import { assert, assertEquals, assertThrows } from '@std/assert';
import { CodeDirectory } from './codedirectory.ts';
import { CodeDirectoryBuilder } from './codedirectorybuilder.ts';
import {
	kSecCodeSignatureHashSHA1,
	kSecCodeSignatureHashSHA256,
	kSecCodeSignatureHashSHA256Truncated,
	kSecCodeSignatureHashSHA384,
	kSecCodeSignatureHashSHA512,
	UINT32_MAX,
} from '../const.ts';

Deno.test('BYTE_LENGTH', () => {
	assertEquals(CodeDirectory.BYTE_LENGTH, 96);
});

Deno.test('identifier', () => {
	const identifier = 'Identifier';
	const builder = new CodeDirectoryBuilder(kSecCodeSignatureHashSHA1);
	builder.identifier(new TextEncoder().encode(identifier));
	const cd = builder.build();
	const cstr = new TextEncoder().encode(`${identifier}\0`);
	assertEquals(
		new Uint8Array(
			cd.identifier.buffer,
			cd.identifier.byteOffset,
			cstr.byteLength,
		),
		cstr,
	);
});

Deno.test('signingLimit', () => {
	const builder = new CodeDirectoryBuilder(kSecCodeSignatureHashSHA1);
	builder.execLength = 1;
	assertEquals(builder.build().signingLimit, 1n);
	builder.execLength = UINT32_MAX + 1;
	assertEquals(builder.build().signingLimit, BigInt(UINT32_MAX + 1));
});

Deno.test('scatterVector', () => {
	const builder = new CodeDirectoryBuilder(kSecCodeSignatureHashSHA1);
	builder.execLength = 1;
	assertEquals(builder.build().scatterVector, null);
	builder.scatter(1);
	assert(builder.build().scatterVector);
});

Deno.test('teamID', () => {
	const identifier = 'Team-Identifier';
	const builder = new CodeDirectoryBuilder(kSecCodeSignatureHashSHA1);
	assertEquals(builder.build().teamID, null);
	builder.teamID(new TextEncoder().encode(identifier));
	const cd = builder.build();
	const cstr = new TextEncoder().encode(`${identifier}\0`);
	const { teamID } = cd;
	assert(teamID);
	assertEquals(
		new Uint8Array(teamID.buffer, teamID.byteOffset, cstr.byteLength),
		cstr,
	);
});

Deno.test('execSegmentBase', () => {
	const builder = new CodeDirectoryBuilder(kSecCodeSignatureHashSHA1);
	assertEquals(builder.build().execSegmentBase, 0n);
	builder.execSeg(1n, 2n, 3n);
	assertEquals(builder.build().execSegmentBase, 1n);
});

Deno.test('execSegmentLimit', () => {
	const builder = new CodeDirectoryBuilder(kSecCodeSignatureHashSHA1);
	assertEquals(builder.build().execSegmentLimit, 0n);
	builder.execSeg(1n, 2n, 3n);
	assertEquals(builder.build().execSegmentLimit, 2n);
});

Deno.test('execSegmentFlags', () => {
	const builder = new CodeDirectoryBuilder(kSecCodeSignatureHashSHA1);
	assertEquals(builder.build().execSegmentFlags, 0n);
	builder.execSeg(1n, 2n, 3n);
	assertEquals(builder.build().execSegmentFlags, 3n);
});

Deno.test('runtimeVersion', () => {
	const builder = new CodeDirectoryBuilder(kSecCodeSignatureHashSHA1);
	assertEquals(builder.build().runtimeVersion, 0);
	builder.runTimeVersion(123);
	assertEquals(builder.build().runtimeVersion, 123);
});

Deno.test('getSlot', () => {
	const builder = new CodeDirectoryBuilder(kSecCodeSignatureHashSHA1);
	const cd = builder.build(CodeDirectory.supportsPreEncrypt);
	assertEquals(cd.getSlot(0, true), null);
});

Deno.test('hashFor', () => {
	assertEquals(
		CodeDirectory.hashFor(kSecCodeSignatureHashSHA1).digestLength(),
		20,
	);
	assertEquals(
		CodeDirectory.hashFor(kSecCodeSignatureHashSHA256).digestLength(),
		32,
	);
	assertEquals(
		CodeDirectory.hashFor(kSecCodeSignatureHashSHA384).digestLength(),
		48,
	);
	assertEquals(
		CodeDirectory.hashFor(kSecCodeSignatureHashSHA256Truncated)
			.digestLength(),
		20,
	);

	// Not supported, intentional or an oversight?
	assertThrows(() => CodeDirectory.hashFor(kSecCodeSignatureHashSHA512));
});
