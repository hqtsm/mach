import { assertEquals, assertGreater, assertRejects } from '@std/assert';
import type { Reader } from '../../helpers/reader.ts';
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
import {
	errSecCSTooBig,
	kSecCodeSignatureHashSHA1,
	kSecCodeSignatureHashSHA256,
} from '../CSCommon.ts';
import { Security_CodeSigning_CodeDirectory_Builder } from './cdbuilder.ts';
import {
	Security_CodeSigning_CodeDirectory,
	Security_CodeSigning_CodeDirectory_Scatter,
} from './codedirectory.ts';

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

Deno.test('Security_CodeSigning_CodeDirectory_Builder: hashType', () => {
	let builder = new Security_CodeSigning_CodeDirectory_Builder(
		kSecCodeSignatureHashSHA1,
	);
	assertEquals(
		Security_CodeSigning_CodeDirectory_Builder.hashType(builder),
		kSecCodeSignatureHashSHA1,
	);

	builder = new Security_CodeSigning_CodeDirectory_Builder(
		kSecCodeSignatureHashSHA256,
	);
	assertEquals(
		Security_CodeSigning_CodeDirectory_Builder.hashType(builder),
		kSecCodeSignatureHashSHA256,
	);
});

Deno.test('Security_CodeSigning_CodeDirectory_Builder: opened', () => {
	const builder = new Security_CodeSigning_CodeDirectory_Builder(
		kSecCodeSignatureHashSHA1,
	);
	assertEquals(
		Security_CodeSigning_CodeDirectory_Builder.opened(builder),
		false,
	);
});

Deno.test('Security_CodeSigning_CodeDirectory_Builder: identifier', async () => {
	const expected = new TextEncoder().encode('IDENTIFIER');
	const builder = new Security_CodeSigning_CodeDirectory_Builder(
		kSecCodeSignatureHashSHA1,
	);
	Security_CodeSigning_CodeDirectory_Builder.executable(
		builder,
		new Blob([]),
		0,
		0,
		0,
	);
	Security_CodeSigning_CodeDirectory_Builder.identifier(
		builder,
		new Uint8Array([1, ...expected, 1]).slice(1, -1),
	);
	{
		const cd = await Security_CodeSigning_CodeDirectory_Builder.build(
			builder,
		);
		const ptr = Security_CodeSigning_CodeDirectory.identifier(cd);
		const data = new Uint8Array(ptr.buffer, ptr.byteOffset);
		assertEquals(data.slice(0, data.indexOf(0)), expected);
	}
	Security_CodeSigning_CodeDirectory_Builder.identifier(
		builder,
		expected.buffer,
	);
	{
		const cd = await Security_CodeSigning_CodeDirectory_Builder.build(
			builder,
		);
		const ptr = Security_CodeSigning_CodeDirectory.identifier(cd);
		const data = new Uint8Array(ptr.buffer, ptr.byteOffset);
		assertEquals(data.slice(0, data.indexOf(0)), expected);
	}
});

Deno.test('Security_CodeSigning_CodeDirectory_Builder: teamID', async () => {
	const expected = new TextEncoder().encode('TEAMID');
	const builder = new Security_CodeSigning_CodeDirectory_Builder(
		kSecCodeSignatureHashSHA1,
	);
	Security_CodeSigning_CodeDirectory_Builder.executable(
		builder,
		new Blob([]),
		0,
		0,
		0,
	);
	Security_CodeSigning_CodeDirectory_Builder.teamID(
		builder,
		new Uint8Array([1, ...expected, 1]).slice(1, -1),
	);
	{
		const cd = await Security_CodeSigning_CodeDirectory_Builder.build(
			builder,
		);
		const ptr = Security_CodeSigning_CodeDirectory.teamID(cd)!;
		const data = new Uint8Array(ptr.buffer, ptr.byteOffset);
		assertEquals(data.slice(0, data.indexOf(0)), expected);
	}
	Security_CodeSigning_CodeDirectory_Builder.teamID(builder, expected.buffer);
	{
		const cd = await Security_CodeSigning_CodeDirectory_Builder.build(
			builder,
		);
		const ptr = Security_CodeSigning_CodeDirectory.teamID(cd)!;
		const data = new Uint8Array(ptr.buffer, ptr.byteOffset);
		assertEquals(data.slice(0, data.indexOf(0)), expected);
	}
});

Deno.test('Security_CodeSigning_CodeDirectory_Builder: codeSlots', async () => {
	let builder = new Security_CodeSigning_CodeDirectory_Builder(
		kSecCodeSignatureHashSHA1,
	);
	Security_CodeSigning_CodeDirectory_Builder.executable(
		builder,
		new Blob([]),
		0,
		0,
		0,
	);
	const zero = Security_CodeSigning_CodeDirectory.size(
		await Security_CodeSigning_CodeDirectory_Builder.build(builder),
	);

	Security_CodeSigning_CodeDirectory_Builder.reopen(
		builder,
		new Blob([new Uint8Array(1)]),
		0,
		1,
	);
	assertEquals(
		Security_CodeSigning_CodeDirectory.size(
			await Security_CodeSigning_CodeDirectory_Builder.build(builder),
		),
		zero + CS_SHA1_LEN * 1,
	);

	builder = new Security_CodeSigning_CodeDirectory_Builder(
		kSecCodeSignatureHashSHA1,
	);
	Security_CodeSigning_CodeDirectory_Builder.executable(
		builder,
		new Blob([new Uint8Array(1024)]),
		1024,
		0,
		1024,
	);
	assertEquals(
		Security_CodeSigning_CodeDirectory.size(
			await Security_CodeSigning_CodeDirectory_Builder.build(builder),
		),
		zero + CS_SHA1_LEN * 1,
	);

	Security_CodeSigning_CodeDirectory_Builder.reopen(
		builder,
		new Blob([new Uint8Array(1025)]),
		0,
		1025,
	);
	assertEquals(
		Security_CodeSigning_CodeDirectory.size(
			await Security_CodeSigning_CodeDirectory_Builder.build(builder),
		),
		zero + CS_SHA1_LEN * 2,
	);
});

Deno.test('Security_CodeSigning_CodeDirectory_Builder: addExecSegFlags', async () => {
	const builder = new Security_CodeSigning_CodeDirectory_Builder(
		kSecCodeSignatureHashSHA1,
	);
	Security_CodeSigning_CodeDirectory_Builder.executable(
		builder,
		new Blob([]),
		0,
		0,
		0,
	);
	Security_CodeSigning_CodeDirectory_Builder.execSeg(builder, 1n, 2n, 0n);
	Security_CodeSigning_CodeDirectory_Builder.addExecSegFlags(builder, 1n);
	assertEquals(
		(await Security_CodeSigning_CodeDirectory_Builder.build(builder))
			.execSegFlags,
		1n,
	);

	Security_CodeSigning_CodeDirectory_Builder.addExecSegFlags(builder, 2n);
	assertEquals(
		(await Security_CodeSigning_CodeDirectory_Builder.build(builder))
			.execSegFlags,
		3n,
	);

	Security_CodeSigning_CodeDirectory_Builder.addExecSegFlags(builder, 4n);
	assertEquals(
		(await Security_CodeSigning_CodeDirectory_Builder.build(builder))
			.execSegFlags,
		7n,
	);
});

Deno.test('Security_CodeSigning_CodeDirectory_Builder: specialSlot', async () => {
	const builder = new Security_CodeSigning_CodeDirectory_Builder(
		kSecCodeSignatureHashSHA1,
	);
	Security_CodeSigning_CodeDirectory_Builder.executable(
		builder,
		new Blob([]),
		0,
		0,
		0,
	);
	const zero = Security_CodeSigning_CodeDirectory.size(
		await Security_CodeSigning_CodeDirectory_Builder.build(builder),
	);
	assertEquals(
		Security_CodeSigning_CodeDirectory.size(
			await Security_CodeSigning_CodeDirectory_Builder.build(builder),
		),
		zero + CS_SHA1_LEN * 0,
	);

	await Security_CodeSigning_CodeDirectory_Builder.specialSlot(
		builder,
		1,
		new ArrayBuffer(),
	);
	assertEquals(
		Security_CodeSigning_CodeDirectory.size(
			await Security_CodeSigning_CodeDirectory_Builder.build(builder),
		),
		zero + CS_SHA1_LEN * 1,
	);
});

Deno.test('Security_CodeSigning_CodeDirectory_Builder: createScatter', async () => {
	const builder = new Security_CodeSigning_CodeDirectory_Builder(
		kSecCodeSignatureHashSHA1,
	);
	Security_CodeSigning_CodeDirectory_Builder.executable(
		builder,
		new Blob([]),
		0,
		0,
		0,
	);
	assertEquals(
		Security_CodeSigning_CodeDirectory_Builder.scatter(builder),
		null,
	);

	const scatter = Security_CodeSigning_CodeDirectory_Builder.scatter(
		builder,
		2,
	);
	scatter[0].count = 1;
	scatter[1].count = 2;
	assertEquals(
		scatter.buffer.byteLength,
		Security_CodeSigning_CodeDirectory_Scatter.BYTE_LENGTH * 3,
	);
	await Security_CodeSigning_CodeDirectory_Builder.build(builder);
});

Deno.test('Security_CodeSigning_CodeDirectory_Builder: version and size', () => {
	let size = 0;
	const builder = new Security_CodeSigning_CodeDirectory_Builder(
		kSecCodeSignatureHashSHA1,
	);
	Security_CodeSigning_CodeDirectory_Builder.executable(
		builder,
		new Blob([new Uint8Array(1)]),
		1024,
		0,
		1,
	);

	assertEquals(
		Security_CodeSigning_CodeDirectory_Builder.minVersion(builder),
		Security_CodeSigning_CodeDirectory.supportsScatter,
	);

	builder.minVersion = Security_CodeSigning_CodeDirectory.earliestVersion;
	assertEquals(
		Security_CodeSigning_CodeDirectory_Builder.minVersion(builder),
		Security_CodeSigning_CodeDirectory.earliestVersion,
	);
	assertGreater(
		Security_CodeSigning_CodeDirectory_Builder.size(
			builder,
			Security_CodeSigning_CodeDirectory_Builder.minVersion(builder),
		),
		size,
	);
	size = Security_CodeSigning_CodeDirectory_Builder.size(
		builder,
		Security_CodeSigning_CodeDirectory_Builder.minVersion(builder),
	);

	Security_CodeSigning_CodeDirectory_Builder.scatter(builder, 1);
	assertEquals(
		Security_CodeSigning_CodeDirectory_Builder.minVersion(builder),
		Security_CodeSigning_CodeDirectory.supportsScatter,
	);
	assertGreater(
		Security_CodeSigning_CodeDirectory_Builder.size(
			builder,
			Security_CodeSigning_CodeDirectory_Builder.minVersion(builder),
		),
		size,
	);
	size = Security_CodeSigning_CodeDirectory_Builder.size(
		builder,
		Security_CodeSigning_CodeDirectory_Builder.minVersion(builder),
	);

	Security_CodeSigning_CodeDirectory_Builder.teamID(
		builder,
		new TextEncoder().encode('TEAM'),
	);
	assertEquals(
		Security_CodeSigning_CodeDirectory_Builder.minVersion(builder),
		Security_CodeSigning_CodeDirectory.supportsTeamID,
	);
	assertGreater(
		Security_CodeSigning_CodeDirectory_Builder.size(
			builder,
			Security_CodeSigning_CodeDirectory_Builder.minVersion(builder),
		),
		size,
	);
	size = Security_CodeSigning_CodeDirectory_Builder.size(
		builder,
		Security_CodeSigning_CodeDirectory_Builder.minVersion(builder),
	);

	Security_CodeSigning_CodeDirectory_Builder.reopen(
		builder,
		new Blob([]),
		0,
		UINT32_MAX + 1,
	);
	assertEquals(
		Security_CodeSigning_CodeDirectory_Builder.minVersion(builder),
		Security_CodeSigning_CodeDirectory.supportsCodeLimit64,
	);
	assertGreater(
		Security_CodeSigning_CodeDirectory_Builder.size(
			builder,
			Security_CodeSigning_CodeDirectory_Builder.minVersion(builder),
		),
		size,
	);
	size = Security_CodeSigning_CodeDirectory_Builder.size(
		builder,
		Security_CodeSigning_CodeDirectory_Builder.minVersion(builder),
	);

	Security_CodeSigning_CodeDirectory_Builder.execSeg(builder, 0n, 1n, 0n);
	assertEquals(
		Security_CodeSigning_CodeDirectory_Builder.minVersion(builder),
		Security_CodeSigning_CodeDirectory.supportsExecSegment,
	);
	assertGreater(
		Security_CodeSigning_CodeDirectory_Builder.size(
			builder,
			Security_CodeSigning_CodeDirectory_Builder.minVersion(builder),
		),
		size,
	);
	size = Security_CodeSigning_CodeDirectory_Builder.size(
		builder,
		Security_CodeSigning_CodeDirectory_Builder.minVersion(builder),
	);

	Security_CodeSigning_CodeDirectory_Builder.generatePreEncryptHashes(
		builder,
		true,
	);
	assertEquals(
		Security_CodeSigning_CodeDirectory_Builder.minVersion(builder),
		Security_CodeSigning_CodeDirectory.supportsPreEncrypt,
	);
	assertGreater(
		Security_CodeSigning_CodeDirectory_Builder.size(
			builder,
			Security_CodeSigning_CodeDirectory_Builder.minVersion(builder),
		),
		size,
	);

	Security_CodeSigning_CodeDirectory_Builder.generatePreEncryptHashes(
		builder,
		false,
	);
	Security_CodeSigning_CodeDirectory_Builder.runTimeVersion(builder, 1);
	assertEquals(
		Security_CodeSigning_CodeDirectory_Builder.minVersion(builder),
		Security_CodeSigning_CodeDirectory.supportsPreEncrypt,
	);
	assertGreater(
		Security_CodeSigning_CodeDirectory_Builder.size(
			builder,
			Security_CodeSigning_CodeDirectory_Builder.minVersion(builder),
		),
		size,
	);

	Security_CodeSigning_CodeDirectory_Builder.scatter(builder, 0);
	testOOM(
		[Security_CodeSigning_CodeDirectory_Scatter.BYTE_LENGTH * 2],
		() => {
			assertThrowsUnixError(
				() =>
					Security_CodeSigning_CodeDirectory_Builder.scatter(
						builder,
						1,
					),
				ENOMEM,
			);
		},
	);
});

Deno.test('Security_CodeSigning_CodeDirectory_Builder: platform', async () => {
	const builder = new Security_CodeSigning_CodeDirectory_Builder(
		kSecCodeSignatureHashSHA1,
	);
	Security_CodeSigning_CodeDirectory_Builder.executable(
		builder,
		new Blob([]),
		0,
		0,
		0,
	);
	Security_CodeSigning_CodeDirectory_Builder.platform(
		builder,
		PLATFORM_MACOS,
	);
	assertEquals(
		(await Security_CodeSigning_CodeDirectory_Builder.build(builder))
			.platform,
		PLATFORM_MACOS,
	);
});

Deno.test('Security_CodeSigning_CodeDirectory_Builder: generatePreEncryptHashes', async () => {
	const builder = new Security_CodeSigning_CodeDirectory_Builder(
		kSecCodeSignatureHashSHA1,
	);
	Security_CodeSigning_CodeDirectory_Builder.executable(
		builder,
		new Blob([new Uint8Array(1)]),
		0,
		0,
		1,
	);

	builder.minVersion = Security_CodeSigning_CodeDirectory.supportsPreEncrypt;
	const zero = Security_CodeSigning_CodeDirectory.size(
		await Security_CodeSigning_CodeDirectory_Builder.build(builder),
	);

	Security_CodeSigning_CodeDirectory_Builder.generatePreEncryptHashes(
		builder,
		true,
	);
	assertEquals(
		Security_CodeSigning_CodeDirectory.size(
			await Security_CodeSigning_CodeDirectory_Builder.build(builder),
		),
		zero + CS_SHA1_LEN * 1,
	);
});

Deno.test('Security_CodeSigning_CodeDirectory_Builder: read validation', async () => {
	const builder = new Security_CodeSigning_CodeDirectory_Builder(
		kSecCodeSignatureHashSHA1,
	);
	Security_CodeSigning_CodeDirectory_Builder.executable(
		builder,
		new ErrorReader(1024),
		1024,
		0,
		UINT32_MAX + 1,
	);
	await assertRejects(
		() => Security_CodeSigning_CodeDirectory_Builder.build(builder),
		Error,
		'BadReader',
	);
});

Deno.test('Security_CodeSigning_CodeDirectory_Builder: codeslots limit', async () => {
	const builder = new Security_CodeSigning_CodeDirectory_Builder(
		kSecCodeSignatureHashSHA1,
	);
	const size = UINT32_MAX + 1;
	Security_CodeSigning_CodeDirectory_Builder.executable(
		builder,
		new ErrorReader(size),
		1,
		0,
		size,
	);
	await assertRejectsMacOSError(
		() => Security_CodeSigning_CodeDirectory_Builder.build(builder),
		errSecCSTooBig,
	);
});

Deno.test('Security_CodeSigning_CodeDirectory_Builder: build', async () => {
	const builder = new Security_CodeSigning_CodeDirectory_Builder(
		kSecCodeSignatureHashSHA1,
	);
	const size = Security_CodeSigning_CodeDirectory_Builder.size(
		builder,
		Security_CodeSigning_CodeDirectory_Builder.minVersion(builder),
	);
	await testOOM([size], async () => {
		await assertRejectsUnixError(
			() => Security_CodeSigning_CodeDirectory_Builder.build(builder),
			ENOMEM,
		);
	});
});
