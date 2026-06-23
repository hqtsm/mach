import { assert, assertEquals, assertRejects } from '@std/assert';
import { crypto as stdCrypto } from '@std/crypto';
import type { Reader } from '../../helpers/reader.ts';
import { PAGE_SIZE_ARM64 as PAGE_SIZE } from '../../mach/vm_param.ts';
import {
	errSecCSSignatureUnsupported,
	errSecCSUnsupportedDigestAlgorithm,
	kSecCodeSignatureHashSHA1,
	kSecCodeSignatureHashSHA256,
	kSecCodeSignatureHashSHA256Truncated,
	kSecCodeSignatureHashSHA384,
	kSecCodeSignatureHashSHA512,
	kSecCodeSignatureNoHash,
} from '../CSCommon.ts';
import { kSecCodeCDHashLength } from '../CSCommonPriv.ts';
import { Security_CodeSigning_CodeDirectory_Builder } from './cdbuilder.ts';
import {
	kSecCS_CODEDIRECTORYFILE,
	kSecCS_ENTITLEMENTDERFILE,
	kSecCS_ENTITLEMENTFILE,
	kSecCS_LAUNCHCONSTRAINTPARENTFILE,
	kSecCS_LAUNCHCONSTRAINTRESPONSIBLEFILE,
	kSecCS_LAUNCHCONSTRAINTSELFFILE,
	kSecCS_LIBRARYCONSTRAINTFILE,
	kSecCS_REPSPECIFICFILE,
	kSecCS_REQUIREMENTSFILE,
	kSecCS_RESOURCEDIRFILE,
	kSecCS_SIGNATUREFILE,
	kSecCS_TOPDIRECTORYFILE,
	Security_CodeSigning_cdAlternateCodeDirectorySlots,
	Security_CodeSigning_cdCodeDirectorySlot,
	Security_CodeSigning_cdComponentIsBlob,
	Security_CodeSigning_cdComponentPerArchitecture,
	Security_CodeSigning_cdEntitlementDERSlot,
	Security_CodeSigning_cdEntitlementSlot,
	Security_CodeSigning_cdIdentificationSlot,
	Security_CodeSigning_cdLaunchConstraintParent,
	Security_CodeSigning_cdLaunchConstraintResponsible,
	Security_CodeSigning_cdLaunchConstraintSelf,
	Security_CodeSigning_cdLibraryConstraint,
	Security_CodeSigning_cdRepSpecificSlot,
	Security_CodeSigning_cdRequirementsSlot,
	Security_CodeSigning_cdResourceDirSlot,
	Security_CodeSigning_cdSignatureSlot,
	Security_CodeSigning_cdSlotCount,
	Security_CodeSigning_cdSlotMax,
	Security_CodeSigning_cdTicketSlot,
	Security_CodeSigning_cdTopDirectorySlot,
	Security_CodeSigning_CodeDirectory,
	Security_CodeSigning_CodeDirectory_Scatter,
} from './codedirectory.ts';
import { assertThrowsMacOSError } from '../../spec/assert.ts';

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

Deno.test('Security_CodeSigning_CodeDirectory_Scatter: BYTE_LENGTH', () => {
	assertEquals(Security_CodeSigning_CodeDirectory_Scatter.BYTE_LENGTH, 24);
});

Deno.test('Security_CodeSigning_CodeDirectory: BYTE_LENGTH', () => {
	assertEquals(Security_CodeSigning_CodeDirectory.BYTE_LENGTH, 96);
});

Deno.test('Security_CodeSigning_CodeDirectory: identifier', async () => {
	const identifier = 'Identifier';
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
		new TextEncoder().encode(identifier),
	);
	const cd = await Security_CodeSigning_CodeDirectory_Builder.build(builder);
	const cstr = new TextEncoder().encode(`${identifier}\0`);
	const ptr = Security_CodeSigning_CodeDirectory.identifier(cd);
	assertEquals(
		new Uint8Array(ptr.buffer, ptr.byteOffset, cstr.byteLength),
		cstr,
	);
});

Deno.test('Security_CodeSigning_CodeDirectory: signingLimit', async () => {
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
	const cd = await Security_CodeSigning_CodeDirectory_Builder.build(builder);
	assertEquals(Security_CodeSigning_CodeDirectory.signingLimit(cd), 1n);

	// Test a big directory without big code blob.
	builder.minVersion = Security_CodeSigning_CodeDirectory.supportsCodeLimit64;
	const cd2 = await Security_CodeSigning_CodeDirectory_Builder.build(builder);
	cd2.codeLimit64 = BigInt(cd2.codeLimit);
	cd2.codeLimit = 0;
	assertEquals(Security_CodeSigning_CodeDirectory.signingLimit(cd2), 1n);
});

Deno.test('Security_CodeSigning_CodeDirectory: maxSpecialSlot', async () => {
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
	const cd = await Security_CodeSigning_CodeDirectory_Builder.build(builder);
	assertEquals(Security_CodeSigning_CodeDirectory.maxSpecialSlot(cd), 0);
	cd.nSpecialSlots = Security_CodeSigning_cdSlotMax;
	assertEquals(
		Security_CodeSigning_CodeDirectory.maxSpecialSlot(cd),
		Security_CodeSigning_cdSlotMax,
	);
	cd.nSpecialSlots = Security_CodeSigning_cdSlotMax + 1;
	assertEquals(
		Security_CodeSigning_CodeDirectory.maxSpecialSlot(cd),
		Security_CodeSigning_cdSlotMax,
	);
});

Deno.test('Security_CodeSigning_CodeDirectory: scatterVector', async () => {
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
	assertEquals(
		Security_CodeSigning_CodeDirectory.scatterVector(
			await Security_CodeSigning_CodeDirectory_Builder.build(builder),
		),
		null,
	);
	Security_CodeSigning_CodeDirectory_Builder.scatter(builder, 1);
	assert(
		Security_CodeSigning_CodeDirectory.scatterVector(
			await Security_CodeSigning_CodeDirectory_Builder.build(builder),
		),
	);
});

Deno.test('Security_CodeSigning_CodeDirectory: teamID', async () => {
	const identifier = 'Team-Identifier';
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
		Security_CodeSigning_CodeDirectory.teamID(
			await Security_CodeSigning_CodeDirectory_Builder.build(builder),
		),
		null,
	);
	Security_CodeSigning_CodeDirectory_Builder.teamID(
		builder,
		new TextEncoder().encode(identifier),
	);
	const cd = await Security_CodeSigning_CodeDirectory_Builder.build(builder);
	const cstr = new TextEncoder().encode(`${identifier}\0`);
	const ptr = Security_CodeSigning_CodeDirectory.teamID(cd);
	assert(ptr);
	assertEquals(
		new Uint8Array(ptr.buffer, ptr.byteOffset, cstr.byteLength),
		cstr,
	);
});

Deno.test('Security_CodeSigning_CodeDirectory: execSegmentBase', async () => {
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
		Security_CodeSigning_CodeDirectory.execSegmentBase(
			await Security_CodeSigning_CodeDirectory_Builder.build(builder),
		),
		0n,
	);
	Security_CodeSigning_CodeDirectory_Builder.execSeg(builder, 1n, 2n, 3n);
	assertEquals(
		Security_CodeSigning_CodeDirectory.execSegmentBase(
			await Security_CodeSigning_CodeDirectory_Builder.build(builder),
		),
		1n,
	);
});

Deno.test('Security_CodeSigning_CodeDirectory: execSegmentLimit', async () => {
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
		Security_CodeSigning_CodeDirectory.execSegmentLimit(
			await Security_CodeSigning_CodeDirectory_Builder.build(builder),
		),
		0n,
	);
	Security_CodeSigning_CodeDirectory_Builder.execSeg(builder, 1n, 2n, 3n);
	assertEquals(
		Security_CodeSigning_CodeDirectory.execSegmentLimit(
			await Security_CodeSigning_CodeDirectory_Builder.build(builder),
		),
		2n,
	);
});

Deno.test('Security_CodeSigning_CodeDirectory: execSegmentFlags', async () => {
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
		Security_CodeSigning_CodeDirectory.execSegmentFlags(
			await Security_CodeSigning_CodeDirectory_Builder.build(builder),
		),
		0n,
	);
	Security_CodeSigning_CodeDirectory_Builder.execSeg(builder, 1n, 2n, 3n);
	assertEquals(
		Security_CodeSigning_CodeDirectory.execSegmentFlags(
			await Security_CodeSigning_CodeDirectory_Builder.build(builder),
		),
		3n,
	);
});

Deno.test('Security_CodeSigning_CodeDirectory: runtimeVersion', async () => {
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
		Security_CodeSigning_CodeDirectory.runtimeVersion(
			await Security_CodeSigning_CodeDirectory_Builder.build(builder),
		),
		0,
	);
	Security_CodeSigning_CodeDirectory_Builder.runTimeVersion(builder, 123);
	assertEquals(
		Security_CodeSigning_CodeDirectory.runtimeVersion(
			await Security_CodeSigning_CodeDirectory_Builder.build(builder),
		),
		123,
	);
});

Deno.test('Security_CodeSigning_CodeDirectory: validateSlot', async () => {
	const view = new Uint8Array([...'TESTING 123'].map((x) => x.charCodeAt(0)));
	const buff = view.buffer;
	const blob = new Blob([buff]);
	const len = view.length;
	const builder = new Security_CodeSigning_CodeDirectory_Builder(
		kSecCodeSignatureHashSHA1,
	);
	await Security_CodeSigning_CodeDirectory_Builder.specialSlot(
		builder,
		2,
		buff,
	);
	Security_CodeSigning_CodeDirectory_Builder.executable(
		builder,
		new Blob([]),
		0,
		0,
		0,
	);
	const cd = await Security_CodeSigning_CodeDirectory_Builder.build(builder);
	for (const [name, data] of Object.entries({ view, blob, buff })) {
		assertEquals(
			// deno-lint-ignore no-await-in-loop
			await Security_CodeSigning_CodeDirectory.validateSlot(
				cd,
				data,
				len,
				-2,
				false,
			),
			true,
			name,
		);
		assertEquals(
			// deno-lint-ignore no-await-in-loop
			await Security_CodeSigning_CodeDirectory.validateSlot(
				cd,
				data,
				len - 1,
				-2,
				false,
			),
			false,
			name,
		);
		assertEquals(
			// deno-lint-ignore no-await-in-loop
			await Security_CodeSigning_CodeDirectory.validateSlot(
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
});

Deno.test('Security_CodeSigning_CodeDirectory: slotIsPresent', async () => {
	const builder = new Security_CodeSigning_CodeDirectory_Builder(
		kSecCodeSignatureHashSHA1,
	);
	await Security_CodeSigning_CodeDirectory_Builder.specialSlot(
		builder,
		2,
		new ArrayBuffer(0),
	);
	Security_CodeSigning_CodeDirectory_Builder.executable(
		builder,
		new Blob([]),
		0,
		0,
		0,
	);
	const cd = await Security_CodeSigning_CodeDirectory_Builder.build(builder);
	assertEquals(
		Security_CodeSigning_CodeDirectory.slotIsPresent(cd, -1),
		false,
	);
	assertEquals(
		Security_CodeSigning_CodeDirectory.slotIsPresent(cd, -2),
		true,
	);
	assertEquals(
		Security_CodeSigning_CodeDirectory.slotIsPresent(cd, -3),
		false,
	);
});

Deno.test('Security_CodeSigning_CodeDirectory: getSlot', async () => {
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
	const cd = await Security_CodeSigning_CodeDirectory_Builder.build(builder);
	assertEquals(Security_CodeSigning_CodeDirectory.getSlot(cd, 0, true), null);
	assertEquals(Security_CodeSigning_CodeDirectory.preEncryptHashes(cd), null);
});

Deno.test('Security_CodeSigning_CodeDirectory: getHash', () => {
	const cd = new Security_CodeSigning_CodeDirectory(
		new ArrayBuffer(Security_CodeSigning_CodeDirectory.BYTE_LENGTH),
	);
	cd.hashType = kSecCodeSignatureHashSHA1;
	assertEquals(
		Security_CodeSigning_CodeDirectory.getHash(cd).digestLength(),
		20,
	);
	cd.hashType = kSecCodeSignatureHashSHA256;
	assertEquals(
		Security_CodeSigning_CodeDirectory.getHash(cd).digestLength(),
		32,
	);
	cd.hashType = kSecCodeSignatureHashSHA384;
	assertEquals(
		Security_CodeSigning_CodeDirectory.getHash(cd).digestLength(),
		48,
	);
	cd.hashType = kSecCodeSignatureHashSHA256Truncated;
	assertEquals(
		Security_CodeSigning_CodeDirectory.getHash(cd).digestLength(),
		20,
	);

	// Not supported, intentional or an oversight?
	cd.hashType = kSecCodeSignatureHashSHA512;
	assertThrowsMacOSError(
		() => Security_CodeSigning_CodeDirectory.getHash(cd),
		errSecCSSignatureUnsupported,
	);
});

Deno.test('Security_CodeSigning_CodeDirectory: cdhash', async () => {
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
	const cd = await Security_CodeSigning_CodeDirectory_Builder.build(builder);
	cd.hashType = kSecCodeSignatureHashSHA1;
	assertEquals(
		(await Security_CodeSigning_CodeDirectory.cdhash(cd)).byteLength,
		20,
	);
	assertEquals(
		(await Security_CodeSigning_CodeDirectory.cdhash(cd, true)).byteLength,
		kSecCodeCDHashLength,
	);
	assertEquals(
		(await Security_CodeSigning_CodeDirectory.cdhash(
			cd,
			true,
			crypto.subtle,
		)).byteLength,
		kSecCodeCDHashLength,
	);
	cd.hashType = kSecCodeSignatureHashSHA256;
	assertEquals(
		(await Security_CodeSigning_CodeDirectory.cdhash(cd)).byteLength,
		32,
	);
	assertEquals(
		(await Security_CodeSigning_CodeDirectory.cdhash(cd, true)).byteLength,
		kSecCodeCDHashLength,
	);
	assertEquals(
		(await Security_CodeSigning_CodeDirectory.cdhash(
			cd,
			true,
			crypto.subtle,
		)).byteLength,
		kSecCodeCDHashLength,
	);
});

Deno.test('Security_CodeSigning_CodeDirectory: hashFor', () => {
	assertEquals(
		Security_CodeSigning_CodeDirectory.hashFor(kSecCodeSignatureHashSHA1)
			.digestLength(),
		20,
	);
	assertEquals(
		Security_CodeSigning_CodeDirectory.hashFor(kSecCodeSignatureHashSHA256)
			.digestLength(),
		32,
	);
	assertEquals(
		Security_CodeSigning_CodeDirectory.hashFor(kSecCodeSignatureHashSHA384)
			.digestLength(),
		48,
	);
	assertEquals(
		Security_CodeSigning_CodeDirectory.hashFor(
			kSecCodeSignatureHashSHA256Truncated,
		)
			.digestLength(),
		20,
	);

	// Not supported, intentional or an oversight?
	assertThrowsMacOSError(
		() =>
			Security_CodeSigning_CodeDirectory.hashFor(
				kSecCodeSignatureHashSHA512,
			),
		errSecCSSignatureUnsupported,
	);
});

Deno.test('Security_CodeSigning_CodeDirectory: multipleHashFileData hashes', async () => {
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
	const data = new Uint8Array(PAGE_SIZE * 3);
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
		await Security_CodeSigning_CodeDirectory.multipleHashFileData(
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

Deno.test('Security_CodeSigning_CodeDirectory: multipleHashFileData error', async () => {
	const reader = new ErrorReader(PAGE_SIZE * 3);
	await assertRejects(
		() =>
			Security_CodeSigning_CodeDirectory.multipleHashFileData(
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

Deno.test('Security_CodeSigning_CodeDirectory: viableHash', () => {
	assertEquals(
		Security_CodeSigning_CodeDirectory.viableHash(
			kSecCodeSignatureHashSHA1,
		),
		true,
	);
	assertEquals(
		Security_CodeSigning_CodeDirectory.viableHash(
			kSecCodeSignatureHashSHA256,
		),
		true,
	);
	assertEquals(
		Security_CodeSigning_CodeDirectory.viableHash(
			kSecCodeSignatureHashSHA384,
		),
		true,
	);
	assertEquals(
		Security_CodeSigning_CodeDirectory.viableHash(
			kSecCodeSignatureHashSHA256Truncated,
		),
		true,
	);
	assertEquals(
		Security_CodeSigning_CodeDirectory.viableHash(
			kSecCodeSignatureHashSHA512,
		),
		false,
	);
});

Deno.test('Security_CodeSigning_CodeDirectory: bestHashOf', () => {
	const types = new Set([
		kSecCodeSignatureHashSHA384,
		kSecCodeSignatureHashSHA256,
		kSecCodeSignatureHashSHA256Truncated,
		kSecCodeSignatureHashSHA1,
		kSecCodeSignatureNoHash,
	]);
	assertEquals(
		Security_CodeSigning_CodeDirectory.bestHashOf(types),
		kSecCodeSignatureHashSHA384,
	);
	types.delete(kSecCodeSignatureHashSHA384);
	assertEquals(
		Security_CodeSigning_CodeDirectory.bestHashOf(types),
		kSecCodeSignatureHashSHA256,
	);
	types.delete(kSecCodeSignatureHashSHA256);
	assertEquals(
		Security_CodeSigning_CodeDirectory.bestHashOf(types),
		kSecCodeSignatureHashSHA256Truncated,
	);
	types.delete(kSecCodeSignatureHashSHA256Truncated);
	assertEquals(
		Security_CodeSigning_CodeDirectory.bestHashOf(types),
		kSecCodeSignatureHashSHA1,
	);
	types.delete(kSecCodeSignatureHashSHA1);
	assertThrowsMacOSError(
		() => Security_CodeSigning_CodeDirectory.bestHashOf(types),
		errSecCSUnsupportedDigestAlgorithm,
	);
});

Deno.test('Security_CodeSigning_CodeDirectory: hexHash', () => {
	const cd = new Security_CodeSigning_CodeDirectory(
		new ArrayBuffer(Security_CodeSigning_CodeDirectory.BYTE_LENGTH),
	);
	cd.hashSize = 20;
	const sha1 = '01 23 45 67 89 ab cd ef f0 00 ff 0f fe dc ba 98 76 54 32 10';
	const hex = Security_CodeSigning_CodeDirectory.hexHash(
		cd,
		new Uint8Array(sha1.split(/\s+/).map((x) => parseInt(x, 16))),
	);
	assertEquals(String.fromCharCode(...hex), sha1.replace(/\s+/g, ''));
});

Deno.test('Security_CodeSigning_CodeDirectory: canonicalSlotName', () => {
	assertEquals(
		Security_CodeSigning_CodeDirectory.canonicalSlotName(
			Security_CodeSigning_cdRequirementsSlot,
		),
		kSecCS_REQUIREMENTSFILE,
	);
	assertEquals(
		Security_CodeSigning_CodeDirectory.canonicalSlotName(
			Security_CodeSigning_cdAlternateCodeDirectorySlots,
		),
		`${kSecCS_REQUIREMENTSFILE}-1`,
	);
	assertEquals(
		Security_CodeSigning_CodeDirectory.canonicalSlotName(
			Security_CodeSigning_cdAlternateCodeDirectorySlots + 1,
		),
		`${kSecCS_REQUIREMENTSFILE}-2`,
	);
	assertEquals(
		Security_CodeSigning_CodeDirectory.canonicalSlotName(
			Security_CodeSigning_cdAlternateCodeDirectorySlots + 2,
		),
		`${kSecCS_REQUIREMENTSFILE}-3`,
	);
	assertEquals(
		Security_CodeSigning_CodeDirectory.canonicalSlotName(
			Security_CodeSigning_cdAlternateCodeDirectorySlots + 3,
		),
		`${kSecCS_REQUIREMENTSFILE}-4`,
	);
	assertEquals(
		Security_CodeSigning_CodeDirectory.canonicalSlotName(
			Security_CodeSigning_cdAlternateCodeDirectorySlots + 4,
		),
		`${kSecCS_REQUIREMENTSFILE}-5`,
	);
	assertEquals(
		Security_CodeSigning_CodeDirectory.canonicalSlotName(
			Security_CodeSigning_cdResourceDirSlot,
		),
		kSecCS_RESOURCEDIRFILE,
	);
	assertEquals(
		Security_CodeSigning_CodeDirectory.canonicalSlotName(
			Security_CodeSigning_cdCodeDirectorySlot,
		),
		kSecCS_CODEDIRECTORYFILE,
	);
	assertEquals(
		Security_CodeSigning_CodeDirectory.canonicalSlotName(
			Security_CodeSigning_cdSignatureSlot,
		),
		kSecCS_SIGNATUREFILE,
	);
	assertEquals(
		Security_CodeSigning_CodeDirectory.canonicalSlotName(
			Security_CodeSigning_cdTopDirectorySlot,
		),
		kSecCS_TOPDIRECTORYFILE,
	);
	assertEquals(
		Security_CodeSigning_CodeDirectory.canonicalSlotName(
			Security_CodeSigning_cdEntitlementSlot,
		),
		kSecCS_ENTITLEMENTFILE,
	);
	assertEquals(
		Security_CodeSigning_CodeDirectory.canonicalSlotName(
			Security_CodeSigning_cdEntitlementDERSlot,
		),
		kSecCS_ENTITLEMENTDERFILE,
	);
	assertEquals(
		Security_CodeSigning_CodeDirectory.canonicalSlotName(
			Security_CodeSigning_cdRepSpecificSlot,
		),
		kSecCS_REPSPECIFICFILE,
	);
	assertEquals(
		Security_CodeSigning_CodeDirectory.canonicalSlotName(
			Security_CodeSigning_cdLaunchConstraintSelf,
		),
		kSecCS_LAUNCHCONSTRAINTSELFFILE,
	);
	assertEquals(
		Security_CodeSigning_CodeDirectory.canonicalSlotName(
			Security_CodeSigning_cdLaunchConstraintParent,
		),
		kSecCS_LAUNCHCONSTRAINTPARENTFILE,
	);
	assertEquals(
		Security_CodeSigning_CodeDirectory.canonicalSlotName(
			Security_CodeSigning_cdLaunchConstraintResponsible,
		),
		kSecCS_LAUNCHCONSTRAINTRESPONSIBLEFILE,
	);
	assertEquals(
		Security_CodeSigning_CodeDirectory.canonicalSlotName(
			Security_CodeSigning_cdLibraryConstraint,
		),
		kSecCS_LIBRARYCONSTRAINTFILE,
	);
	assertEquals(
		Security_CodeSigning_CodeDirectory.canonicalSlotName(
			Security_CodeSigning_cdSlotCount,
		),
		null,
	);
});

Deno.test('Security_CodeSigning_CodeDirectory: slotAttributes', () => {
	assertEquals(
		Security_CodeSigning_CodeDirectory.slotAttributes(
			Security_CodeSigning_cdRequirementsSlot,
		),
		Security_CodeSigning_cdComponentIsBlob,
	);
	assertEquals(
		Security_CodeSigning_CodeDirectory.slotAttributes(
			Security_CodeSigning_cdCodeDirectorySlot,
		),
		Security_CodeSigning_cdComponentPerArchitecture |
			Security_CodeSigning_cdComponentIsBlob,
	);
	assertEquals(
		Security_CodeSigning_CodeDirectory.slotAttributes(
			Security_CodeSigning_cdAlternateCodeDirectorySlots,
		),
		Security_CodeSigning_cdComponentPerArchitecture |
			Security_CodeSigning_cdComponentIsBlob,
	);
	assertEquals(
		Security_CodeSigning_CodeDirectory.slotAttributes(
			Security_CodeSigning_cdAlternateCodeDirectorySlots + 1,
		),
		Security_CodeSigning_cdComponentPerArchitecture |
			Security_CodeSigning_cdComponentIsBlob,
	);
	assertEquals(
		Security_CodeSigning_CodeDirectory.slotAttributes(
			Security_CodeSigning_cdAlternateCodeDirectorySlots + 2,
		),
		Security_CodeSigning_cdComponentPerArchitecture |
			Security_CodeSigning_cdComponentIsBlob,
	);
	assertEquals(
		Security_CodeSigning_CodeDirectory.slotAttributes(
			Security_CodeSigning_cdAlternateCodeDirectorySlots + 3,
		),
		Security_CodeSigning_cdComponentPerArchitecture |
			Security_CodeSigning_cdComponentIsBlob,
	);
	assertEquals(
		Security_CodeSigning_CodeDirectory.slotAttributes(
			Security_CodeSigning_cdAlternateCodeDirectorySlots + 4,
		),
		Security_CodeSigning_cdComponentPerArchitecture |
			Security_CodeSigning_cdComponentIsBlob,
	);
	assertEquals(
		Security_CodeSigning_CodeDirectory.slotAttributes(
			Security_CodeSigning_cdSignatureSlot,
		),
		Security_CodeSigning_cdComponentPerArchitecture,
	);
	assertEquals(
		Security_CodeSigning_CodeDirectory.slotAttributes(
			Security_CodeSigning_cdLaunchConstraintSelf,
		),
		Security_CodeSigning_cdComponentIsBlob,
	);
	assertEquals(
		Security_CodeSigning_CodeDirectory.slotAttributes(
			Security_CodeSigning_cdLaunchConstraintParent,
		),
		Security_CodeSigning_cdComponentIsBlob,
	);
	assertEquals(
		Security_CodeSigning_CodeDirectory.slotAttributes(
			Security_CodeSigning_cdLaunchConstraintResponsible,
		),
		Security_CodeSigning_cdComponentIsBlob,
	);
	assertEquals(
		Security_CodeSigning_CodeDirectory.slotAttributes(
			Security_CodeSigning_cdLibraryConstraint,
		),
		Security_CodeSigning_cdComponentIsBlob,
	);
	assertEquals(
		Security_CodeSigning_CodeDirectory.slotAttributes(
			Security_CodeSigning_cdEntitlementSlot,
		),
		Security_CodeSigning_cdComponentIsBlob,
	);
	assertEquals(
		Security_CodeSigning_CodeDirectory.slotAttributes(
			Security_CodeSigning_cdEntitlementDERSlot,
		),
		Security_CodeSigning_cdComponentIsBlob,
	);
	assertEquals(
		Security_CodeSigning_CodeDirectory.slotAttributes(
			Security_CodeSigning_cdIdentificationSlot,
		),
		Security_CodeSigning_cdComponentPerArchitecture,
	);
	assertEquals(
		Security_CodeSigning_CodeDirectory.slotAttributes(
			Security_CodeSigning_cdTicketSlot,
		),
		0,
	);
	assertEquals(
		Security_CodeSigning_CodeDirectory.slotAttributes(
			Security_CodeSigning_cdSlotCount,
		),
		0,
	);
});
