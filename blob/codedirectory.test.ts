import { assert, assertEquals, assertThrows } from '@std/assert';
import {
	kSecCodeSignatureHashSHA1,
	kSecCodeSignatureHashSHA256,
	kSecCodeSignatureHashSHA256Truncated,
	kSecCodeSignatureHashSHA384,
	kSecCodeSignatureHashSHA512,
} from '../const.ts';
import { CodeDirectory } from './codedirectory.ts';
import { CodeDirectoryBuilder } from './codedirectorybuilder.ts';

const createBuilder = async (
	hashType: number,
): Promise<CodeDirectoryBuilder> => {
	const builder = new CodeDirectoryBuilder(hashType);
	if (typeof crypto === 'undefined') {
		builder.crypto = await import('node:crypto');
	}
	return builder;
};

Deno.test('BYTE_LENGTH', () => {
	assertEquals(CodeDirectory.BYTE_LENGTH, 96);
});

Deno.test('identifier', async () => {
	const identifier = 'Identifier';
	const builder = await createBuilder(kSecCodeSignatureHashSHA1);
	builder.executable(new Blob([]), 0, 0, 0);
	builder.identifier(new TextEncoder().encode(identifier));
	const cd = await builder.build();
	const cstr = new TextEncoder().encode(`${identifier}\0`);
	const ptr = cd.identifier();
	assertEquals(
		new Uint8Array(ptr.buffer, ptr.byteOffset, cstr.byteLength),
		cstr,
	);
});

Deno.test('signingLimit', async () => {
	const builder = await createBuilder(kSecCodeSignatureHashSHA1);
	builder.executable(new Blob([new Uint8Array(1)]), 0, 0, 1);
	if (typeof crypto === 'undefined') {
		builder.crypto = await import('node:crypto');
	}
	const cd = await builder.build();
	assertEquals(cd.signingLimit(), 1n);

	// Test a big directory without big code blob.
	const cd2 = await builder.build(CodeDirectory.supportsCodeLimit64);
	cd2.codeLimit64 = BigInt(cd2.codeLimit);
	cd2.codeLimit = 0;
	assertEquals(cd2.signingLimit(), 1n);
});

Deno.test('scatterVector', async () => {
	const builder = await createBuilder(kSecCodeSignatureHashSHA1);
	builder.executable(new Blob([new Uint8Array(1)]), 0, 0, 1);
	assertEquals((await builder.build()).scatterVector(), null);
	builder.scatter(1);
	assert((await builder.build()).scatterVector());
});

Deno.test('teamID', async () => {
	const identifier = 'Team-Identifier';
	const builder = await createBuilder(kSecCodeSignatureHashSHA1);
	builder.executable(new Blob([]), 0, 0, 0);
	assertEquals((await builder.build()).teamID(), null);
	builder.teamID(new TextEncoder().encode(identifier));
	const cd = await builder.build();
	const cstr = new TextEncoder().encode(`${identifier}\0`);
	const ptr = cd.teamID();
	assert(ptr);
	assertEquals(
		new Uint8Array(ptr.buffer, ptr.byteOffset, cstr.byteLength),
		cstr,
	);
});

Deno.test('execSegmentBase', async () => {
	const builder = await createBuilder(kSecCodeSignatureHashSHA1);
	builder.executable(new Blob([]), 0, 0, 0);
	assertEquals((await builder.build()).execSegmentBase(), 0n);
	builder.execSeg(1n, 2n, 3n);
	assertEquals((await builder.build()).execSegmentBase(), 1n);
});

Deno.test('execSegmentLimit', async () => {
	const builder = await createBuilder(kSecCodeSignatureHashSHA1);
	builder.executable(new Blob([]), 0, 0, 0);
	assertEquals((await builder.build()).execSegmentLimit(), 0n);
	builder.execSeg(1n, 2n, 3n);
	assertEquals((await builder.build()).execSegmentLimit(), 2n);
});

Deno.test('execSegmentFlags', async () => {
	const builder = await createBuilder(kSecCodeSignatureHashSHA1);
	builder.executable(new Blob([]), 0, 0, 0);
	assertEquals((await builder.build()).execSegmentFlags(), 0n);
	builder.execSeg(1n, 2n, 3n);
	assertEquals((await builder.build()).execSegmentFlags(), 3n);
});

Deno.test('runtimeVersion', async () => {
	const builder = await createBuilder(kSecCodeSignatureHashSHA1);
	builder.executable(new Blob([]), 0, 0, 0);
	assertEquals((await builder.build()).runtimeVersion(), 0);
	builder.runTimeVersion(123);
	assertEquals((await builder.build()).runtimeVersion(), 123);
});

Deno.test('getSlot', async () => {
	const builder = await createBuilder(kSecCodeSignatureHashSHA1);
	builder.executable(new Blob([]), 0, 0, 0);
	const cd = await builder.build(CodeDirectory.supportsPreEncrypt);
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
	assertThrows(
		() => CodeDirectory.hashFor(kSecCodeSignatureHashSHA512),
		RangeError,
		`Unsupported hash type: ${kSecCodeSignatureHashSHA512}`,
	);
});
