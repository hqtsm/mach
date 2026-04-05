import { assertEquals, assertGreater, assertRejects } from '@std/assert';
import { CS_SHA1_LEN } from '../../kern/cs_blobs.ts';
import { ENOMEM } from '../../libc/errno.ts';
import { UINT32_MAX } from '../../libc/stdint.ts';
import { PLATFORM_MACOS } from '../../mach-o/loader.ts';
import {
	assertRejectsMacOSError,
	assertRejectsUnixError,
	assertThrowsUnixError,
} from '../../spec/assert.ts';
import { testOOM } from '../../spec/memory.ts';
import type { Reader } from '../../util/reader.ts';
import {
	errSecCSTooBig,
	kSecCodeSignatureHashSHA1,
	kSecCodeSignatureHashSHA256,
} from '../CSCommon.ts';
import { CodeDirectory_Builder } from './cdbuilder.ts';
import { CodeDirectory, CodeDirectory_Scatter } from './codedirectory.ts';

class ErrorReader implements Reader {
	#size: number;

	#type: string;

	constructor(size: number, type: string = '') {
		this.#size = size;
		this.#type = type;
	}

	public get size(): number {
		return this.#size;
	}

	public get type(): string {
		return this.#type;
	}

	slice(start?: number, end?: number, contentType?: string): Reader {
		start ??= 0;
		end ??= this.#size;
		return new ErrorReader(start < end ? end - start : 0, contentType);
	}

	// deno-lint-ignore require-await
	public async arrayBuffer(): Promise<ArrayBuffer> {
		throw new Error('BadReader');
	}
}

Deno.test('CodeDirectoryBuilder: hashType', () => {
	let builder = new CodeDirectory_Builder(kSecCodeSignatureHashSHA1);
	assertEquals(
		CodeDirectory_Builder.hashType(builder),
		kSecCodeSignatureHashSHA1,
	);

	builder = new CodeDirectory_Builder(kSecCodeSignatureHashSHA256);
	assertEquals(
		CodeDirectory_Builder.hashType(builder),
		kSecCodeSignatureHashSHA256,
	);
});

Deno.test('CodeDirectoryBuilder: opened', () => {
	const builder = new CodeDirectory_Builder(kSecCodeSignatureHashSHA1);
	assertEquals(CodeDirectory_Builder.opened(builder), false);
});

Deno.test('CodeDirectoryBuilder: identifier', async () => {
	const expected = new TextEncoder().encode('IDENTIFIER');
	const builder = new CodeDirectory_Builder(kSecCodeSignatureHashSHA1);
	CodeDirectory_Builder.executable(builder, new Blob([]), 0, 0, 0);
	CodeDirectory_Builder.identifier(
		builder,
		new Uint8Array([1, ...expected, 1]).slice(1, -1),
	);
	{
		const cd = await CodeDirectory_Builder.build(builder);
		const ptr = CodeDirectory.identifier(cd);
		const data = new Uint8Array(ptr.buffer, ptr.byteOffset);
		assertEquals(data.slice(0, data.indexOf(0)), expected);
	}
	CodeDirectory_Builder.identifier(builder, expected.buffer);
	{
		const cd = await CodeDirectory_Builder.build(builder);
		const ptr = CodeDirectory.identifier(cd);
		const data = new Uint8Array(ptr.buffer, ptr.byteOffset);
		assertEquals(data.slice(0, data.indexOf(0)), expected);
	}
});

Deno.test('CodeDirectoryBuilder: teamID', async () => {
	const expected = new TextEncoder().encode('TEAMID');
	const builder = new CodeDirectory_Builder(kSecCodeSignatureHashSHA1);
	CodeDirectory_Builder.executable(builder, new Blob([]), 0, 0, 0);
	CodeDirectory_Builder.teamID(
		builder,
		new Uint8Array([1, ...expected, 1]).slice(1, -1),
	);
	{
		const cd = await CodeDirectory_Builder.build(builder);
		const ptr = CodeDirectory.teamID(cd)!;
		const data = new Uint8Array(ptr.buffer, ptr.byteOffset);
		assertEquals(data.slice(0, data.indexOf(0)), expected);
	}
	CodeDirectory_Builder.teamID(builder, expected.buffer);
	{
		const cd = await CodeDirectory_Builder.build(builder);
		const ptr = CodeDirectory.teamID(cd)!;
		const data = new Uint8Array(ptr.buffer, ptr.byteOffset);
		assertEquals(data.slice(0, data.indexOf(0)), expected);
	}
});

Deno.test('CodeDirectoryBuilder: codeSlots', async () => {
	let builder = new CodeDirectory_Builder(kSecCodeSignatureHashSHA1);
	CodeDirectory_Builder.executable(builder, new Blob([]), 0, 0, 0);
	const zero = CodeDirectory.size(await CodeDirectory_Builder.build(builder));

	CodeDirectory_Builder.reopen(builder, new Blob([new Uint8Array(1)]), 0, 1);
	assertEquals(
		CodeDirectory.size(await CodeDirectory_Builder.build(builder)),
		zero + CS_SHA1_LEN * 1,
	);

	builder = new CodeDirectory_Builder(kSecCodeSignatureHashSHA1);
	CodeDirectory_Builder.executable(
		builder,
		new Blob([new Uint8Array(1024)]),
		1024,
		0,
		1024,
	);
	assertEquals(
		CodeDirectory.size(await CodeDirectory_Builder.build(builder)),
		zero + CS_SHA1_LEN * 1,
	);

	CodeDirectory_Builder.reopen(
		builder,
		new Blob([new Uint8Array(1025)]),
		0,
		1025,
	);
	assertEquals(
		CodeDirectory.size(await CodeDirectory_Builder.build(builder)),
		zero + CS_SHA1_LEN * 2,
	);
});

Deno.test('CodeDirectoryBuilder: addExecSegFlags', async () => {
	const builder = new CodeDirectory_Builder(kSecCodeSignatureHashSHA1);
	CodeDirectory_Builder.executable(builder, new Blob([]), 0, 0, 0);
	CodeDirectory_Builder.execSeg(builder, 1n, 2n, 0n);
	CodeDirectory_Builder.addExecSegFlags(builder, 1n);
	assertEquals((await CodeDirectory_Builder.build(builder)).execSegFlags, 1n);

	CodeDirectory_Builder.addExecSegFlags(builder, 2n);
	assertEquals((await CodeDirectory_Builder.build(builder)).execSegFlags, 3n);

	CodeDirectory_Builder.addExecSegFlags(builder, 4n);
	assertEquals((await CodeDirectory_Builder.build(builder)).execSegFlags, 7n);
});

Deno.test('CodeDirectoryBuilder: specialSlot', async () => {
	const builder = new CodeDirectory_Builder(kSecCodeSignatureHashSHA1);
	CodeDirectory_Builder.executable(builder, new Blob([]), 0, 0, 0);
	const zero = CodeDirectory.size(await CodeDirectory_Builder.build(builder));
	assertEquals(
		CodeDirectory.size(await CodeDirectory_Builder.build(builder)),
		zero + CS_SHA1_LEN * 0,
	);

	await CodeDirectory_Builder.specialSlot(builder, 1, new ArrayBuffer(0));
	assertEquals(
		CodeDirectory.size(await CodeDirectory_Builder.build(builder)),
		zero + CS_SHA1_LEN * 1,
	);
});

Deno.test('CodeDirectoryBuilder: createScatter', async () => {
	const builder = new CodeDirectory_Builder(kSecCodeSignatureHashSHA1);
	CodeDirectory_Builder.executable(builder, new Blob([]), 0, 0, 0);
	assertEquals(CodeDirectory_Builder.scatter(builder), null);

	const scatter = CodeDirectory_Builder.scatter(builder, 2);
	scatter[0].count = 1;
	scatter[1].count = 2;
	assertEquals(
		scatter.buffer.byteLength,
		CodeDirectory_Scatter.BYTE_LENGTH * 3,
	);
	await CodeDirectory_Builder.build(builder);
});

Deno.test('CodeDirectoryBuilder: version and size', () => {
	let size = 0;
	const builder = new CodeDirectory_Builder(kSecCodeSignatureHashSHA1);
	CodeDirectory_Builder.executable(
		builder,
		new Blob([new Uint8Array(1)]),
		1024,
		0,
		1,
	);

	assertEquals(
		CodeDirectory_Builder.minVersion(builder),
		CodeDirectory.earliestVersion,
	);
	assertGreater(CodeDirectory_Builder.size(builder), size);
	size = CodeDirectory_Builder.size(builder);

	CodeDirectory_Builder.scatter(builder, 1);
	assertEquals(
		CodeDirectory_Builder.minVersion(builder),
		CodeDirectory.supportsScatter,
	);
	assertGreater(CodeDirectory_Builder.size(builder), size);
	size = CodeDirectory_Builder.size(builder);

	CodeDirectory_Builder.teamID(builder, new TextEncoder().encode('TEAM'));
	assertEquals(
		CodeDirectory_Builder.minVersion(builder),
		CodeDirectory.supportsTeamID,
	);
	assertGreater(CodeDirectory_Builder.size(builder), size);
	size = CodeDirectory_Builder.size(builder);

	CodeDirectory_Builder.reopen(builder, new Blob([]), 0, UINT32_MAX + 1);
	assertEquals(
		CodeDirectory_Builder.minVersion(builder),
		CodeDirectory.supportsCodeLimit64,
	);
	assertGreater(CodeDirectory_Builder.size(builder), size);
	size = CodeDirectory_Builder.size(builder);

	CodeDirectory_Builder.execSeg(builder, 0n, 1n, 0n);
	assertEquals(
		CodeDirectory_Builder.minVersion(builder),
		CodeDirectory.supportsExecSegment,
	);
	assertGreater(CodeDirectory_Builder.size(builder), size);
	size = CodeDirectory_Builder.size(builder);

	CodeDirectory_Builder.generatePreEncryptHashes(builder, true);
	assertEquals(
		CodeDirectory_Builder.minVersion(builder),
		CodeDirectory.supportsPreEncrypt,
	);
	assertGreater(CodeDirectory_Builder.size(builder), size);

	CodeDirectory_Builder.generatePreEncryptHashes(builder, false);
	CodeDirectory_Builder.runTimeVersion(builder, 1);
	assertEquals(
		CodeDirectory_Builder.minVersion(builder),
		CodeDirectory.supportsPreEncrypt,
	);
	assertGreater(CodeDirectory_Builder.size(builder), size);

	CodeDirectory_Builder.scatter(builder, 0);
	testOOM([CodeDirectory_Scatter.BYTE_LENGTH * 2], () => {
		assertThrowsUnixError(
			() => CodeDirectory_Builder.scatter(builder, 1),
			ENOMEM,
		);
	});
});

Deno.test('CodeDirectoryBuilder: platform', async () => {
	const builder = new CodeDirectory_Builder(kSecCodeSignatureHashSHA1);
	CodeDirectory_Builder.executable(builder, new Blob([]), 0, 0, 0);
	CodeDirectory_Builder.platform(builder, PLATFORM_MACOS);
	assertEquals(
		(await CodeDirectory_Builder.build(builder)).platform,
		PLATFORM_MACOS,
	);
});

Deno.test('CodeDirectoryBuilder: generatePreEncryptHashes', async () => {
	const version = CodeDirectory.supportsPreEncrypt;
	const builder = new CodeDirectory_Builder(kSecCodeSignatureHashSHA1);
	CodeDirectory_Builder.executable(
		builder,
		new Blob([new Uint8Array(1)]),
		0,
		0,
		1,
	);
	const zero = CodeDirectory.size(
		await CodeDirectory_Builder.build(builder, version),
	);

	CodeDirectory_Builder.generatePreEncryptHashes(builder, true);
	assertEquals(
		CodeDirectory.size(await CodeDirectory_Builder.build(builder, version)),
		zero + CS_SHA1_LEN * 1,
	);
});

Deno.test('CodeDirectoryBuilder: read validation', async () => {
	const builder = new CodeDirectory_Builder(kSecCodeSignatureHashSHA1);
	CodeDirectory_Builder.executable(
		builder,
		new ErrorReader(1024),
		1024,
		0,
		UINT32_MAX + 1,
	);
	await assertRejects(
		() => CodeDirectory_Builder.build(builder),
		Error,
		'BadReader',
	);
});

Deno.test('CodeDirectoryBuilder: codeslots limit', async () => {
	const builder = new CodeDirectory_Builder(kSecCodeSignatureHashSHA1);
	const size = UINT32_MAX + 1;
	CodeDirectory_Builder.executable(
		builder,
		new ErrorReader(size),
		1,
		0,
		size,
	);
	await assertRejectsMacOSError(
		() => CodeDirectory_Builder.build(builder),
		errSecCSTooBig,
	);
});

Deno.test('CodeDirectoryBuilder: build', async () => {
	const builder = new CodeDirectory_Builder(kSecCodeSignatureHashSHA1);
	const size = CodeDirectory_Builder.size(builder);
	await testOOM([size], async () => {
		await assertRejectsUnixError(
			() => CodeDirectory_Builder.build(builder),
			ENOMEM,
		);
	});
});
