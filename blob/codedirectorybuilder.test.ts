import {
	assertEquals,
	assertGreater,
	assertRejects,
	assertThrows,
} from '@std/assert';
import {
	CS_SHA1_LEN,
	kSecCodeSignatureHashSHA1,
	kSecCodeSignatureHashSHA256,
	PLATFORM_MACOS,
	UINT32_MAX,
} from '../const.ts';
import type { Reader } from '../util/reader.ts';
import { CodeDirectory } from './codedirectory.ts';
import { CodeDirectoryBuilder } from './codedirectorybuilder.ts';
import { CodeDirectoryScatter } from './codedirectoryscatter.ts';

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

Deno.test('hashType', () => {
	let builder = new CodeDirectoryBuilder(kSecCodeSignatureHashSHA1);
	assertEquals(
		CodeDirectoryBuilder.hashType(builder),
		kSecCodeSignatureHashSHA1,
	);

	builder = new CodeDirectoryBuilder(kSecCodeSignatureHashSHA256);
	assertEquals(
		CodeDirectoryBuilder.hashType(builder),
		kSecCodeSignatureHashSHA256,
	);
});

Deno.test('opened', async () => {
	const builder = new CodeDirectoryBuilder(kSecCodeSignatureHashSHA1);
	assertEquals(CodeDirectoryBuilder.opened(builder), false);

	assertThrows(
		() => CodeDirectoryBuilder.reopen(builder, new Blob([]), 0, 0),
		Error,
		'Executable not open',
	);
	assertEquals(CodeDirectoryBuilder.opened(builder), false);

	await assertRejects(
		() => CodeDirectoryBuilder.build(builder),
		Error,
		'Executable not open',
	);
});

Deno.test('identifier', async () => {
	const expected = new TextEncoder().encode('IDENTIFIER');
	const builder = new CodeDirectoryBuilder(kSecCodeSignatureHashSHA1);
	CodeDirectoryBuilder.executable(builder, new Blob([]), 0, 0, 0);
	CodeDirectoryBuilder.identifier(
		builder,
		new Uint8Array([1, ...expected, 1]).slice(1, -1),
	);
	{
		const cd = await CodeDirectoryBuilder.build(builder);
		const ptr = CodeDirectory.identifier(cd);
		const data = new Uint8Array(ptr.buffer, ptr.byteOffset);
		assertEquals(data.slice(0, data.indexOf(0)), expected);
	}
	CodeDirectoryBuilder.identifier(builder, expected.buffer);
	{
		const cd = await CodeDirectoryBuilder.build(builder);
		const ptr = CodeDirectory.identifier(cd);
		const data = new Uint8Array(ptr.buffer, ptr.byteOffset);
		assertEquals(data.slice(0, data.indexOf(0)), expected);
	}
});

Deno.test('teamID', async () => {
	const expected = new TextEncoder().encode('TEAMID');
	const builder = new CodeDirectoryBuilder(kSecCodeSignatureHashSHA1);
	CodeDirectoryBuilder.executable(builder, new Blob([]), 0, 0, 0);
	CodeDirectoryBuilder.teamID(
		builder,
		new Uint8Array([1, ...expected, 1]).slice(1, -1),
	);
	{
		const cd = await CodeDirectoryBuilder.build(builder);
		const ptr = CodeDirectory.teamID(cd)!;
		const data = new Uint8Array(ptr.buffer, ptr.byteOffset);
		assertEquals(data.slice(0, data.indexOf(0)), expected);
	}
	CodeDirectoryBuilder.teamID(builder, expected.buffer);
	{
		const cd = await CodeDirectoryBuilder.build(builder);
		const ptr = CodeDirectory.teamID(cd)!;
		const data = new Uint8Array(ptr.buffer, ptr.byteOffset);
		assertEquals(data.slice(0, data.indexOf(0)), expected);
	}
});

Deno.test('codeSlots', async () => {
	let builder = new CodeDirectoryBuilder(kSecCodeSignatureHashSHA1);
	CodeDirectoryBuilder.executable(builder, new Blob([]), 0, 0, 0);
	const zero = CodeDirectory.size(await CodeDirectoryBuilder.build(builder));

	CodeDirectoryBuilder.reopen(builder, new Blob([new Uint8Array(1)]), 0, 1);
	assertEquals(
		CodeDirectory.size(await CodeDirectoryBuilder.build(builder)),
		zero + CS_SHA1_LEN * 1,
	);

	builder = new CodeDirectoryBuilder(kSecCodeSignatureHashSHA1);
	CodeDirectoryBuilder.executable(
		builder,
		new Blob([new Uint8Array(1024)]),
		1024,
		0,
		1024,
	);
	assertEquals(
		CodeDirectory.size(await CodeDirectoryBuilder.build(builder)),
		zero + CS_SHA1_LEN * 1,
	);

	CodeDirectoryBuilder.reopen(
		builder,
		new Blob([new Uint8Array(1025)]),
		0,
		1025,
	);
	assertEquals(
		CodeDirectory.size(await CodeDirectoryBuilder.build(builder)),
		zero + CS_SHA1_LEN * 2,
	);
});

Deno.test('addExecSegFlags', async () => {
	const builder = new CodeDirectoryBuilder(kSecCodeSignatureHashSHA1);
	CodeDirectoryBuilder.executable(builder, new Blob([]), 0, 0, 0);
	CodeDirectoryBuilder.execSeg(builder, 1n, 2n, 0n);
	CodeDirectoryBuilder.addExecSegFlags(builder, 1n);
	assertEquals((await CodeDirectoryBuilder.build(builder)).execSegFlags, 1n);

	CodeDirectoryBuilder.addExecSegFlags(builder, 2n);
	assertEquals((await CodeDirectoryBuilder.build(builder)).execSegFlags, 3n);

	CodeDirectoryBuilder.addExecSegFlags(builder, 4n);
	assertEquals((await CodeDirectoryBuilder.build(builder)).execSegFlags, 7n);
});

Deno.test('specialSlot', async () => {
	const builder = new CodeDirectoryBuilder(kSecCodeSignatureHashSHA1);
	CodeDirectoryBuilder.executable(builder, new Blob([]), 0, 0, 0);
	const zero = CodeDirectory.size(await CodeDirectoryBuilder.build(builder));
	await assertRejects(
		() => CodeDirectoryBuilder.specialSlot(builder, 0, new ArrayBuffer(0)),
		RangeError,
		'Invalid slot index: 0',
	);
	assertEquals(
		CodeDirectory.size(await CodeDirectoryBuilder.build(builder)),
		zero + CS_SHA1_LEN * 0,
	);

	await CodeDirectoryBuilder.specialSlot(builder, 1, new ArrayBuffer(0));
	assertEquals(
		CodeDirectory.size(await CodeDirectoryBuilder.build(builder)),
		zero + CS_SHA1_LEN * 1,
	);
});

Deno.test('createScatter', async () => {
	const builder = new CodeDirectoryBuilder(kSecCodeSignatureHashSHA1);
	CodeDirectoryBuilder.executable(builder, new Blob([]), 0, 0, 0);
	assertEquals(CodeDirectoryBuilder.scatter(builder), null);

	let scatter = CodeDirectoryBuilder.scatter(builder, NaN);
	assertEquals(scatter.buffer.byteLength, CodeDirectoryScatter.BYTE_LENGTH);

	scatter = CodeDirectoryBuilder.scatter(builder, 2);
	scatter[0].count = 1;
	scatter[1].count = 2;
	assertEquals(
		scatter.buffer.byteLength,
		CodeDirectoryScatter.BYTE_LENGTH * 3,
	);
	await CodeDirectoryBuilder.build(builder);
});

Deno.test('version and size', () => {
	let size = 0;
	const builder = new CodeDirectoryBuilder(kSecCodeSignatureHashSHA1);
	CodeDirectoryBuilder.executable(
		builder,
		new Blob([new Uint8Array(1)]),
		1024,
		0,
		1,
	);

	assertEquals(
		CodeDirectoryBuilder.minVersion(builder),
		CodeDirectory.earliestVersion,
	);
	assertGreater(CodeDirectoryBuilder.size(builder), size);
	size = CodeDirectoryBuilder.size(builder);

	CodeDirectoryBuilder.scatter(builder, 1);
	assertEquals(
		CodeDirectoryBuilder.minVersion(builder),
		CodeDirectory.supportsScatter,
	);
	assertGreater(CodeDirectoryBuilder.size(builder), size);
	size = CodeDirectoryBuilder.size(builder);

	CodeDirectoryBuilder.teamID(builder, new TextEncoder().encode('TEAM'));
	assertEquals(
		CodeDirectoryBuilder.minVersion(builder),
		CodeDirectory.supportsTeamID,
	);
	assertGreater(CodeDirectoryBuilder.size(builder), size);
	size = CodeDirectoryBuilder.size(builder);

	CodeDirectoryBuilder.reopen(builder, new Blob([]), 0, UINT32_MAX + 1);
	assertEquals(
		CodeDirectoryBuilder.minVersion(builder),
		CodeDirectory.supportsCodeLimit64,
	);
	assertGreater(CodeDirectoryBuilder.size(builder), size);
	size = CodeDirectoryBuilder.size(builder);

	CodeDirectoryBuilder.execSeg(builder, 0n, 1n, 0n);
	assertEquals(
		CodeDirectoryBuilder.minVersion(builder),
		CodeDirectory.supportsExecSegment,
	);
	assertGreater(CodeDirectoryBuilder.size(builder), size);
	size = CodeDirectoryBuilder.size(builder);

	CodeDirectoryBuilder.generatePreEncryptHashes(builder, true);
	assertEquals(
		CodeDirectoryBuilder.minVersion(builder),
		CodeDirectory.supportsPreEncrypt,
	);
	assertGreater(CodeDirectoryBuilder.size(builder), size);

	CodeDirectoryBuilder.generatePreEncryptHashes(builder, false);
	CodeDirectoryBuilder.runTimeVersion(builder, 1);
	assertEquals(
		CodeDirectoryBuilder.minVersion(builder),
		CodeDirectory.supportsPreEncrypt,
	);
	assertGreater(CodeDirectoryBuilder.size(builder), size);
});

Deno.test('platform', async () => {
	const builder = new CodeDirectoryBuilder(kSecCodeSignatureHashSHA1);
	CodeDirectoryBuilder.executable(builder, new Blob([]), 0, 0, 0);
	CodeDirectoryBuilder.platform(builder, PLATFORM_MACOS);
	assertEquals(
		(await CodeDirectoryBuilder.build(builder)).platform,
		PLATFORM_MACOS,
	);
});

Deno.test('generatePreEncryptHashes', async () => {
	const version = CodeDirectory.supportsPreEncrypt;
	const builder = new CodeDirectoryBuilder(kSecCodeSignatureHashSHA1);
	CodeDirectoryBuilder.executable(
		builder,
		new Blob([new Uint8Array(1)]),
		0,
		0,
		1,
	);
	const zero = CodeDirectory.size(
		await CodeDirectoryBuilder.build(builder, version),
	);

	CodeDirectoryBuilder.generatePreEncryptHashes(builder, true);
	assertEquals(
		CodeDirectory.size(await CodeDirectoryBuilder.build(builder, version)),
		zero + CS_SHA1_LEN * 1,
	);
});

Deno.test('Read valiation', async () => {
	const builder = new CodeDirectoryBuilder(kSecCodeSignatureHashSHA1);
	CodeDirectoryBuilder.executable(
		builder,
		new ErrorReader(1024),
		1024,
		0,
		UINT32_MAX + 1,
	);
	await assertRejects(
		() => CodeDirectoryBuilder.build(builder),
		Error,
		'BadReader',
	);
});
