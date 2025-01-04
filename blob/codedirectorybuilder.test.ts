import {
	assertEquals,
	assertGreater,
	assertNotEquals,
	assertThrows,
} from '@std/assert';
import { fixtureMachos, fixtureMachoSigned } from '../spec/fixture.ts';
import { thin } from '../spec/macho.ts';
import { indexOf } from '../spec/u8a.ts';
import { createCodeDirectories } from './codedirectorybuilder.spec.ts';
import { CodeDirectoryBuilder } from './codedirectorybuilder.ts';
import { kSecCodeSignatureHashSHA1, PLATFORM_MACOS } from '../const.ts';
import { CodeDirectory } from './codedirectory.ts';
import { UINT32_MAX } from '../const.ts';
import { kSecCodeSignatureHashSHA256 } from '../const.ts';
import { kSecCodeSignatureHashSHA384 } from '../const.ts';
import { kSecCodeSignatureHashSHA512 } from '../const.ts';
import { kSecCodeSignatureHashSHA256Truncated } from '../const.ts';

const fixtures = fixtureMachos();

Deno.test('codeSlots', () => {
	const builder = new CodeDirectoryBuilder(kSecCodeSignatureHashSHA1);
	assertEquals(builder.codeSlots, 0);
	builder.execLength = 1;
	assertEquals(builder.codeSlots, 1);
	builder.pageSize = 1024;
	builder.execLength = 1024;
	assertEquals(builder.codeSlots, 1);
	builder.execLength = 1025;
	assertEquals(builder.codeSlots, 2);
});

Deno.test('addExecSegFlags', () => {
	const builder = new CodeDirectoryBuilder(kSecCodeSignatureHashSHA1);
	builder.execSeg(1n, 2n, 0n);
	builder.addExecSegFlags(1n);
	assertEquals(builder.build().execSegFlags, 1n);
	builder.addExecSegFlags(2n);
	assertEquals(builder.build().execSegFlags, 3n);
	builder.addExecSegFlags(4n);
	assertEquals(builder.build().execSegFlags, 7n);
});

Deno.test('specialSlot', () => {
	const hash = new Uint8Array(
		[1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4],
	);
	const builder = new CodeDirectoryBuilder(kSecCodeSignatureHashSHA1);
	assertEquals(builder.specialSlots, 0);
	builder.setSpecialSlot(1, hash);
	assertEquals(builder.specialSlots, 1);
	assertThrows(() => builder.setSpecialSlot(0, hash));
	assertThrows(() => builder.setSpecialSlot(1, new Uint8Array()));
	assertEquals(builder.specialSlots, 1);
	assertEquals(builder.getSpecialSlot(1), hash);
	assertEquals(builder.getSpecialSlot(2), null);
	assertThrows(() => builder.getSpecialSlot(0));
});

Deno.test('codeSlot', () => {
	const hash = new Uint8Array(
		[1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4],
	);
	const builder = new CodeDirectoryBuilder(kSecCodeSignatureHashSHA1);
	assertEquals(builder.codeSlots, 0);
	assertThrows(() => builder.getCodeSlot(0));
	assertThrows(() => builder.setCodeSlot(0, hash));
	builder.pageSize = 1024;
	builder.execLength = 1024;
	assertEquals(builder.getCodeSlot(0), null);
	builder.setCodeSlot(0, hash);
	assertEquals(builder.getCodeSlot(0), hash);
	assertEquals(builder.codeSlots, 1);
	assertThrows(() => builder.setCodeSlot(-1, hash));
	assertThrows(() => builder.setCodeSlot(2, hash));
	assertThrows(() => builder.setCodeSlot(0, new Uint8Array()));
	assertEquals(builder.codeSlots, 1);
	assertEquals(builder.getCodeSlot(0), hash);
});

Deno.test('createScatter', () => {
	const builder = new CodeDirectoryBuilder(kSecCodeSignatureHashSHA1);
	assertEquals(builder.scatter(), null);
	let scatter = builder.scatter(NaN);
	assertEquals(scatter.length, 1);
	scatter = builder.scatter(2);
	scatter[0].count = 1;
	scatter[1].count = 2;
	assertEquals(scatter.length, 3);
	builder.build();
});

Deno.test('version and size', () => {
	const hash = new Uint8Array(
		[1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4],
	);

	let size = 0;
	const builder = new CodeDirectoryBuilder(kSecCodeSignatureHashSHA1);
	builder.pageSize = 1024;
	builder.execLength = 1024;
	builder.setCodeSlot(0, hash);

	assertEquals(builder.version, CodeDirectory.earliestVersion);
	assertGreater(builder.size(), size);
	size = builder.size();

	builder.scatter(1);
	assertEquals(builder.version, CodeDirectory.supportsScatter);
	assertGreater(builder.size(), size);
	size = builder.size();

	builder.teamID(new TextEncoder().encode('TEAM'));
	assertEquals(builder.version, CodeDirectory.supportsTeamID);
	assertGreater(builder.size(), size);
	size = builder.size();

	builder.execLength = UINT32_MAX + 1;
	assertEquals(builder.version, CodeDirectory.supportsCodeLimit64);
	assertGreater(builder.size(), size);
	size = builder.size();

	builder.execSeg(0n, 1n, 0n);
	assertEquals(builder.version, CodeDirectory.supportsExecSegment);
	assertGreater(builder.size(), size);
	size = builder.size();

	builder.generatePreEncryptHashes(true);
	assertEquals(builder.version, CodeDirectory.supportsPreEncrypt);
	assertGreater(builder.size(), size);

	builder.generatePreEncryptHashes(false);
	builder.runTimeVersion(1);
	assertEquals(builder.version, CodeDirectory.supportsPreEncrypt);
	assertGreater(builder.size(), size);

	builder.generatePreEncryptHashes(true);
	builder.build();
});

Deno.test('platform', () => {
	const builder = new CodeDirectoryBuilder(kSecCodeSignatureHashSHA1);
	builder.platform(PLATFORM_MACOS);
	assertEquals(builder.build().platform, PLATFORM_MACOS);
});

Deno.test('digestLength', () => {
	for (
		const [hashType, digestLength] of [
			[kSecCodeSignatureHashSHA1, 20],
			[kSecCodeSignatureHashSHA256Truncated, 20],
			[kSecCodeSignatureHashSHA256, 32],
			[kSecCodeSignatureHashSHA384, 48],
			[kSecCodeSignatureHashSHA512, 64],
		]
	) {
		assertEquals(
			CodeDirectoryBuilder.digestLength(hashType),
			digestLength,
			`hashType: ${hashType}`,
		);
	}
	assertThrows(() => CodeDirectoryBuilder.digestLength(0));
});

for (const { kind, arch, file, archs } of fixtures) {
	// Skip binaries with no signed architectures.
	if (![...archs.values()].filter(Boolean).length) {
		continue;
	}

	Deno.test(`${kind}: ${arch}: ${file}`, async () => {
		const { macho, infoPlist, codeResources } = await fixtureMachoSigned(
			kind,
			arch,
			file,
		);

		for (const [arc, info] of archs) {
			// Skip unsigned architectures in fat binaries.
			if (!info) {
				continue;
			}

			const message = (s: string) => `CD: ${arc}: ${s}`;
			const bin = thin(macho, info.arch[0], info.arch[1]);

			for await (
				const cd of createCodeDirectories(
					info,
					bin,
					infoPlist,
					codeResources,
				)
			) {
				const cdBuffer = new Uint8Array(
					cd.buffer,
					cd.byteOffset,
					cd.length,
				);
				const expectedWithin = new Uint8Array(
					bin.buffer,
					bin.byteOffset + info.offset,
					bin.byteLength - info.offset,
				);
				assertNotEquals(
					indexOf(expectedWithin, cdBuffer),
					-1,
					message(`hashType=${cd.hashType}: within`),
				);
			}
		}
	});
}
