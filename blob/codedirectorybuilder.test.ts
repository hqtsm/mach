import { assertEquals, assertGreater, assertThrows } from '@std/assert';
import { CodeDirectoryBuilder } from './codedirectorybuilder.ts';
import { kSecCodeSignatureHashSHA1, PLATFORM_MACOS } from '../const.ts';
import { CodeDirectory } from './codedirectory.ts';
import { UINT32_MAX } from '../const.ts';

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

	assertEquals(builder.minVersion(), CodeDirectory.earliestVersion);
	assertGreater(builder.size(), size);
	size = builder.size();

	builder.scatter(1);
	assertEquals(builder.minVersion(), CodeDirectory.supportsScatter);
	assertGreater(builder.size(), size);
	size = builder.size();

	builder.teamID(new TextEncoder().encode('TEAM'));
	assertEquals(builder.minVersion(), CodeDirectory.supportsTeamID);
	assertGreater(builder.size(), size);
	size = builder.size();

	builder.execLength = UINT32_MAX + 1;
	assertEquals(builder.minVersion(), CodeDirectory.supportsCodeLimit64);
	assertGreater(builder.size(), size);
	size = builder.size();

	builder.execSeg(0n, 1n, 0n);
	assertEquals(builder.minVersion(), CodeDirectory.supportsExecSegment);
	assertGreater(builder.size(), size);
	size = builder.size();

	builder.generatePreEncryptHashes(true);
	assertEquals(builder.minVersion(), CodeDirectory.supportsPreEncrypt);
	assertGreater(builder.size(), size);

	builder.generatePreEncryptHashes(false);
	builder.runTimeVersion(1);
	assertEquals(builder.minVersion(), CodeDirectory.supportsPreEncrypt);
	assertGreater(builder.size(), size);

	builder.generatePreEncryptHashes(true);
	builder.build();
});

Deno.test('platform', () => {
	const builder = new CodeDirectoryBuilder(kSecCodeSignatureHashSHA1);
	builder.platform(PLATFORM_MACOS);
	assertEquals(builder.build().platform, PLATFORM_MACOS);
});
