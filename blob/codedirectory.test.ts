import { assert, assertEquals, assertThrows } from '@std/assert';
import {
	cdSlotMax,
	kSecCodeCDHashLength,
	kSecCodeSignatureHashSHA1,
	kSecCodeSignatureHashSHA256,
	kSecCodeSignatureHashSHA256Truncated,
	kSecCodeSignatureHashSHA384,
	kSecCodeSignatureHashSHA512,
} from '../const.ts';
import { CodeDirectory } from './codedirectory.ts';
import { CodeDirectoryBuilder } from './codedirectorybuilder.ts';

Deno.test('BYTE_LENGTH', () => {
	assertEquals(CodeDirectory.BYTE_LENGTH, 96);
});

Deno.test('identifier', async () => {
	const identifier = 'Identifier';
	const builder = new CodeDirectoryBuilder(kSecCodeSignatureHashSHA1);
	CodeDirectoryBuilder.executable(builder, new Blob([]), 0, 0, 0);
	CodeDirectoryBuilder.identifier(
		builder,
		new TextEncoder().encode(identifier),
	);
	const cd = await CodeDirectoryBuilder.build(builder);
	const cstr = new TextEncoder().encode(`${identifier}\0`);
	const ptr = CodeDirectory.identifier(cd);
	assertEquals(
		new Uint8Array(ptr.buffer, ptr.byteOffset, cstr.byteLength),
		cstr,
	);
});

Deno.test('signingLimit', async () => {
	const builder = new CodeDirectoryBuilder(kSecCodeSignatureHashSHA1);
	CodeDirectoryBuilder.executable(
		builder,
		new Blob([new Uint8Array(1)]),
		0,
		0,
		1,
	);
	if (typeof crypto === 'undefined') {
		builder.crypto = await import('node:crypto');
	}
	const cd = await CodeDirectoryBuilder.build(builder);
	assertEquals(CodeDirectory.signingLimit(cd), 1n);

	// Test a big directory without big code blob.
	const cd2 = await CodeDirectoryBuilder.build(
		builder,
		CodeDirectory.supportsCodeLimit64,
	);
	cd2.codeLimit64 = BigInt(cd2.codeLimit);
	cd2.codeLimit = 0;
	assertEquals(CodeDirectory.signingLimit(cd2), 1n);
});

Deno.test('maxSpecialSlot', async () => {
	const builder = new CodeDirectoryBuilder(kSecCodeSignatureHashSHA1);
	CodeDirectoryBuilder.executable(
		builder,
		new Blob([new Uint8Array(1)]),
		0,
		0,
		1,
	);
	const cd = await CodeDirectoryBuilder.build(builder);
	assertEquals(CodeDirectory.maxSpecialSlot(cd), 0);
	cd.nSpecialSlots = cdSlotMax;
	assertEquals(CodeDirectory.maxSpecialSlot(cd), cdSlotMax);
	cd.nSpecialSlots = cdSlotMax + 1;
	assertEquals(CodeDirectory.maxSpecialSlot(cd), cdSlotMax);
});

Deno.test('scatterVector', async () => {
	const builder = new CodeDirectoryBuilder(kSecCodeSignatureHashSHA1);
	CodeDirectoryBuilder.executable(
		builder,
		new Blob([new Uint8Array(1)]),
		0,
		0,
		1,
	);
	assertEquals(
		CodeDirectory.scatterVector(await CodeDirectoryBuilder.build(builder)),
		null,
	);
	CodeDirectoryBuilder.scatter(builder, 1);
	assert(
		CodeDirectory.scatterVector(await CodeDirectoryBuilder.build(builder)),
	);
});

Deno.test('teamID', async () => {
	const identifier = 'Team-Identifier';
	const builder = new CodeDirectoryBuilder(kSecCodeSignatureHashSHA1);
	CodeDirectoryBuilder.executable(builder, new Blob([]), 0, 0, 0);
	assertEquals(
		CodeDirectory.teamID(await CodeDirectoryBuilder.build(builder)),
		null,
	);
	CodeDirectoryBuilder.teamID(builder, new TextEncoder().encode(identifier));
	const cd = await CodeDirectoryBuilder.build(builder);
	const cstr = new TextEncoder().encode(`${identifier}\0`);
	const ptr = CodeDirectory.teamID(cd);
	assert(ptr);
	assertEquals(
		new Uint8Array(ptr.buffer, ptr.byteOffset, cstr.byteLength),
		cstr,
	);
});

Deno.test('execSegmentBase', async () => {
	const builder = new CodeDirectoryBuilder(kSecCodeSignatureHashSHA1);
	CodeDirectoryBuilder.executable(builder, new Blob([]), 0, 0, 0);
	assertEquals(
		CodeDirectory.execSegmentBase(
			await CodeDirectoryBuilder.build(builder),
		),
		0n,
	);
	CodeDirectoryBuilder.execSeg(builder, 1n, 2n, 3n);
	assertEquals(
		CodeDirectory.execSegmentBase(
			await CodeDirectoryBuilder.build(builder),
		),
		1n,
	);
});

Deno.test('execSegmentLimit', async () => {
	const builder = new CodeDirectoryBuilder(kSecCodeSignatureHashSHA1);
	CodeDirectoryBuilder.executable(builder, new Blob([]), 0, 0, 0);
	assertEquals(
		CodeDirectory.execSegmentLimit(
			await CodeDirectoryBuilder.build(builder),
		),
		0n,
	);
	CodeDirectoryBuilder.execSeg(builder, 1n, 2n, 3n);
	assertEquals(
		CodeDirectory.execSegmentLimit(
			await CodeDirectoryBuilder.build(builder),
		),
		2n,
	);
});

Deno.test('execSegmentFlags', async () => {
	const builder = new CodeDirectoryBuilder(kSecCodeSignatureHashSHA1);
	CodeDirectoryBuilder.executable(builder, new Blob([]), 0, 0, 0);
	assertEquals(
		CodeDirectory.execSegmentFlags(
			await CodeDirectoryBuilder.build(builder),
		),
		0n,
	);
	CodeDirectoryBuilder.execSeg(builder, 1n, 2n, 3n);
	assertEquals(
		CodeDirectory.execSegmentFlags(
			await CodeDirectoryBuilder.build(builder),
		),
		3n,
	);
});

Deno.test('runtimeVersion', async () => {
	const builder = new CodeDirectoryBuilder(kSecCodeSignatureHashSHA1);
	CodeDirectoryBuilder.executable(builder, new Blob([]), 0, 0, 0);
	assertEquals(
		CodeDirectory.runtimeVersion(await CodeDirectoryBuilder.build(builder)),
		0,
	);
	CodeDirectoryBuilder.runTimeVersion(builder, 123);
	assertEquals(
		CodeDirectory.runtimeVersion(await CodeDirectoryBuilder.build(builder)),
		123,
	);
});

Deno.test('slotIsPresent', async () => {
	const builder = new CodeDirectoryBuilder(kSecCodeSignatureHashSHA1);
	await CodeDirectoryBuilder.specialSlot(builder, 2, new ArrayBuffer(0));
	CodeDirectoryBuilder.executable(builder, new Blob([]), 0, 0, 0);
	const cd = await CodeDirectoryBuilder.build(builder);
	assertEquals(CodeDirectory.slotIsPresent(cd, -1), false);
	assertEquals(CodeDirectory.slotIsPresent(cd, -2), true);
	assertEquals(CodeDirectory.slotIsPresent(cd, -3), false);
});

Deno.test('getSlot', async () => {
	const builder = new CodeDirectoryBuilder(kSecCodeSignatureHashSHA1);
	CodeDirectoryBuilder.executable(builder, new Blob([]), 0, 0, 0);
	const cd = await CodeDirectoryBuilder.build(
		builder,
		CodeDirectory.supportsPreEncrypt,
	);
	assertEquals(CodeDirectory.getSlot(cd, 0, true), null);
	assertEquals(CodeDirectory.preEncryptHashes(cd), null);
});

Deno.test('getHash', () => {
	const cd = new CodeDirectory(new ArrayBuffer(CodeDirectory.BYTE_LENGTH));
	cd.hashType = kSecCodeSignatureHashSHA1;
	assertEquals(CodeDirectory.getHash(cd).digestLength(), 20);
	cd.hashType = kSecCodeSignatureHashSHA256;
	assertEquals(CodeDirectory.getHash(cd).digestLength(), 32);
	cd.hashType = kSecCodeSignatureHashSHA384;
	assertEquals(CodeDirectory.getHash(cd).digestLength(), 48);
	cd.hashType = kSecCodeSignatureHashSHA256Truncated;
	assertEquals(CodeDirectory.getHash(cd).digestLength(), 20);

	// Not supported, intentional or an oversight?
	cd.hashType = kSecCodeSignatureHashSHA512;
	assertThrows(
		() => CodeDirectory.getHash(cd),
		RangeError,
		`Unsupported hash type: ${kSecCodeSignatureHashSHA512}`,
	);
});

Deno.test('cdhash', async () => {
	const builder = new CodeDirectoryBuilder(kSecCodeSignatureHashSHA1);
	CodeDirectoryBuilder.executable(builder, new Blob([]), 0, 0, 0);
	const cd = await CodeDirectoryBuilder.build(builder);
	cd.hashType = kSecCodeSignatureHashSHA1;
	assertEquals(
		(await CodeDirectory.cdhash(cd)).byteLength,
		20,
	);
	assertEquals(
		(await CodeDirectory.cdhash(cd, true)).byteLength,
		kSecCodeCDHashLength,
	);
	assertEquals(
		(await CodeDirectory.cdhash(cd, true, crypto.subtle)).byteLength,
		kSecCodeCDHashLength,
	);
	cd.hashType = kSecCodeSignatureHashSHA256;
	assertEquals(
		(await CodeDirectory.cdhash(cd)).byteLength,
		32,
	);
	assertEquals(
		(await CodeDirectory.cdhash(cd, true)).byteLength,
		kSecCodeCDHashLength,
	);
	assertEquals(
		(await CodeDirectory.cdhash(cd, true, crypto.subtle)).byteLength,
		kSecCodeCDHashLength,
	);
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
	assertThrows(
		() => CodeDirectory.hashFor(kSecCodeSignatureHashSHA512),
		RangeError,
		`Unsupported hash type: ${kSecCodeSignatureHashSHA512}`,
	);
});
