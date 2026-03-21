import { assert, assertEquals, assertRejects, assertThrows } from '@std/assert';
import { crypto as stdCrypto } from '@std/crypto';
import { PAGE_SIZE_ARM64 } from '../../mach/vm_param.ts';
import type { Reader } from '../../util/reader.ts';
import {
	kSecCodeSignatureHashSHA1,
	kSecCodeSignatureHashSHA256,
	kSecCodeSignatureHashSHA256Truncated,
	kSecCodeSignatureHashSHA384,
	kSecCodeSignatureHashSHA512,
} from '../CSCommon.ts';
import { kSecCodeCDHashLength } from '../CSCommonPriv.ts';
import { CodeDirectoryBuilder } from './cdbuilder.ts';
import {
	cdSlotMax,
	CodeDirectory,
	CodeDirectoryScatter,
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

	public slice(
		start?: number,
		end?: number,
		contentType?: string,
	): Reader {
		start ??= 0;
		end ??= this.#size;
		return new ErrorReader(start < end ? end - start : 0, contentType);
	}

	// deno-lint-ignore require-await
	public async arrayBuffer(): Promise<ArrayBuffer> {
		throw new Error('ErrorReader');
	}
}

Deno.test('CodeDirectoryScatter: BYTE_LENGTH', () => {
	assertEquals(CodeDirectoryScatter.BYTE_LENGTH, 24);
});

Deno.test('CodeDirectory: BYTE_LENGTH', () => {
	assertEquals(CodeDirectory.BYTE_LENGTH, 96);
});

Deno.test('CodeDirectory: identifier', async () => {
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

Deno.test('CodeDirectory: signingLimit', async () => {
	const builder = new CodeDirectoryBuilder(kSecCodeSignatureHashSHA1);
	CodeDirectoryBuilder.executable(
		builder,
		new Blob([new Uint8Array(1)]),
		0,
		0,
		1,
	);
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

Deno.test('CodeDirectory: maxSpecialSlot', async () => {
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

Deno.test('CodeDirectory: scatterVector', async () => {
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

Deno.test('CodeDirectory: teamID', async () => {
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

Deno.test('CodeDirectory: execSegmentBase', async () => {
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

Deno.test('CodeDirectory: execSegmentLimit', async () => {
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

Deno.test('CodeDirectory: execSegmentFlags', async () => {
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

Deno.test('CodeDirectory: runtimeVersion', async () => {
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

Deno.test('CodeDirectory: validateSlot', async () => {
	const view = new Uint8Array([...'TESTING 123'].map((x) => x.charCodeAt(0)));
	const buff = view.buffer;
	const blob = new Blob([buff]);
	const len = view.length;
	const builder = new CodeDirectoryBuilder(kSecCodeSignatureHashSHA1);
	await CodeDirectoryBuilder.specialSlot(builder, 2, buff);
	CodeDirectoryBuilder.executable(builder, new Blob([]), 0, 0, 0);
	const cd = await CodeDirectoryBuilder.build(builder);
	for (const [name, data] of Object.entries({ view, blob, buff })) {
		assertEquals(
			// deno-lint-ignore no-await-in-loop
			await CodeDirectory.validateSlot(cd, data, len, -2, false),
			true,
			name,
		);
		assertEquals(
			// deno-lint-ignore no-await-in-loop
			await CodeDirectory.validateSlot(cd, data, len - 1, -2, false),
			false,
			name,
		);
		assertEquals(
			// deno-lint-ignore no-await-in-loop
			await CodeDirectory.validateSlot(
				cd,
				data,
				len,
				-2,
				false,
				crypto.subtle,
			),
			true,
			name,
		);
	}

	await assertRejects(
		() => CodeDirectory.validateSlot(cd, view, len, 0, true),
		RangeError,
		'Invalid slot',
	);
});

Deno.test('CodeDirectory: slotIsPresent', async () => {
	const builder = new CodeDirectoryBuilder(kSecCodeSignatureHashSHA1);
	await CodeDirectoryBuilder.specialSlot(builder, 2, new ArrayBuffer(0));
	CodeDirectoryBuilder.executable(builder, new Blob([]), 0, 0, 0);
	const cd = await CodeDirectoryBuilder.build(builder);
	assertEquals(CodeDirectory.slotIsPresent(cd, -1), false);
	assertEquals(CodeDirectory.slotIsPresent(cd, -2), true);
	assertEquals(CodeDirectory.slotIsPresent(cd, -3), false);
});

Deno.test('CodeDirectory: getSlot', async () => {
	const builder = new CodeDirectoryBuilder(kSecCodeSignatureHashSHA1);
	CodeDirectoryBuilder.executable(builder, new Blob([]), 0, 0, 0);
	const cd = await CodeDirectoryBuilder.build(
		builder,
		CodeDirectory.supportsPreEncrypt,
	);
	assertEquals(CodeDirectory.getSlot(cd, 0, true), null);
	assertEquals(CodeDirectory.preEncryptHashes(cd), null);
});

Deno.test('CodeDirectory: getHash', () => {
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

Deno.test('CodeDirectory: cdhash', async () => {
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

Deno.test('CodeDirectory: hashFor', () => {
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

Deno.test('CodeDirectory: multipleHashFileData hashes', async () => {
	const cryptos = {
		subtle: null,
		'jsr:@std/crypto': stdCrypto.subtle,
	};
	const types = new Set([
		kSecCodeSignatureHashSHA1,
		kSecCodeSignatureHashSHA256Truncated,
		kSecCodeSignatureHashSHA256,
		kSecCodeSignatureHashSHA384,
		// Not supported, intentional or an oversight?
		// kSecCodeSignatureHashSHA512,
	]);
	const data = new Uint8Array(PAGE_SIZE_ARM64 * 3);
	for (let i = 0; i < data.length; i++) {
		data[i] = i % 256;
	}
	const limit = data.length - 10;
	const limited = data.subarray(0, limit);
	const expected: [number, Uint8Array][] = [
		[
			kSecCodeSignatureHashSHA1,
			new Uint8Array(await crypto.subtle.digest('SHA-1', limited)),
		],
		[
			kSecCodeSignatureHashSHA256Truncated,
			new Uint8Array(
				(await crypto.subtle.digest('SHA-256', limited)).slice(0, 20),
			),
		],
		[
			kSecCodeSignatureHashSHA256,
			new Uint8Array(await crypto.subtle.digest('SHA-256', limited)),
		],
		[
			kSecCodeSignatureHashSHA384,
			new Uint8Array(await crypto.subtle.digest('SHA-384', limited)),
		],
	];
	for (const [tag, crypto] of Object.entries(cryptos)) {
		const hashed: [number, Uint8Array][] = [];
		// deno-lint-ignore no-await-in-loop
		await CodeDirectory.multipleHashFileData(
			new Blob([data.buffer]),
			limit,
			types,
			async (type, hasher) => {
				const hash = new Uint8Array(hasher.digestLength());
				await hasher.finish(hash);
				hashed.push([type, hash]);
			},
			crypto,
		);
		assertEquals(hashed, expected, tag);
	}
});

Deno.test('CodeDirectory: multipleHashFileData error', async () => {
	const reader = new ErrorReader(PAGE_SIZE_ARM64 * 3);
	await assertRejects(
		() =>
			CodeDirectory.multipleHashFileData(
				reader,
				0,
				new Set([kSecCodeSignatureHashSHA1]),
				// deno-lint-ignore require-await
				async (type) => {
					// Should not be called.
					throw new Error(`Action: ${type}`);
				},
			),
		Error,
		'ErrorReader',
	);
});
