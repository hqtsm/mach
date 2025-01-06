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
import { CodeDirectoryBuilder } from './codedirectorybuilder.ts';
import { CodeDirectory } from './codedirectory.ts';

Deno.test('hashType', () => {
	let builder = new CodeDirectoryBuilder(kSecCodeSignatureHashSHA1);
	assertEquals(builder.hashType(), kSecCodeSignatureHashSHA1);

	builder = new CodeDirectoryBuilder(kSecCodeSignatureHashSHA256);
	assertEquals(builder.hashType(), kSecCodeSignatureHashSHA256);
});

Deno.test('opened', async () => {
	const builder = new CodeDirectoryBuilder(kSecCodeSignatureHashSHA1);
	assertEquals(builder.opened(), false);

	assertThrows(() => builder.reopen(new Blob([]), 0, 0));
	assertEquals(builder.opened(), false);

	await assertRejects(() => builder.build(), Error, 'Executable not open');
});

Deno.test('identifier', async () => {
	const expected = new TextEncoder().encode('IDENTIFIER');
	const builder = new CodeDirectoryBuilder(kSecCodeSignatureHashSHA1);
	builder.executable(new Blob([]), 0, 0, 0);
	builder.identifier(new Uint8Array([1, ...expected, 1]).slice(1, -1));
	{
		const cd = await builder.build();
		const ptr = cd.identifier;
		const data = new Uint8Array(ptr.buffer, ptr.byteOffset);
		assertEquals(data.slice(0, data.indexOf(0)), expected);
	}
	builder.identifier(expected.buffer);
	{
		const cd = await builder.build();
		const ptr = cd.identifier;
		const data = new Uint8Array(ptr.buffer, ptr.byteOffset);
		assertEquals(data.slice(0, data.indexOf(0)), expected);
	}
});

Deno.test('teamID', async () => {
	const expected = new TextEncoder().encode('TEAMID');
	const builder = new CodeDirectoryBuilder(kSecCodeSignatureHashSHA1);
	builder.executable(new Blob([]), 0, 0, 0);
	builder.teamID(new Uint8Array([1, ...expected, 1]).slice(1, -1));
	{
		const cd = await builder.build();
		const ptr = cd.teamID!;
		const data = new Uint8Array(ptr.buffer, ptr.byteOffset);
		assertEquals(data.slice(0, data.indexOf(0)), expected);
	}
	builder.teamID(expected.buffer);
	{
		const cd = await builder.build();
		const ptr = cd.teamID!;
		const data = new Uint8Array(ptr.buffer, ptr.byteOffset);
		assertEquals(data.slice(0, data.indexOf(0)), expected);
	}
});

Deno.test('codeSlots', async () => {
	let builder = new CodeDirectoryBuilder(kSecCodeSignatureHashSHA1);
	builder.executable(new Blob([]), 0, 0, 0);
	const zero = (await builder.build()).length;

	builder.reopen(new Blob([new Uint8Array(1)]), 0, 1);
	assertEquals((await builder.build()).length, zero + CS_SHA1_LEN * 1);

	builder = new CodeDirectoryBuilder(kSecCodeSignatureHashSHA1);
	builder.executable(new Blob([new Uint8Array(1024)]), 1024, 0, 1024);
	assertEquals((await builder.build()).length, zero + CS_SHA1_LEN * 1);

	builder.reopen(new Blob([new Uint8Array(1025)]), 0, 1025);
	assertEquals((await builder.build()).length, zero + CS_SHA1_LEN * 2);
});

Deno.test('addExecSegFlags', async () => {
	const builder = new CodeDirectoryBuilder(kSecCodeSignatureHashSHA1);
	builder.executable(new Blob([]), 0, 0, 0);
	builder.execSeg(1n, 2n, 0n);
	builder.addExecSegFlags(1n);
	assertEquals((await builder.build()).execSegFlags, 1n);

	builder.addExecSegFlags(2n);
	assertEquals((await builder.build()).execSegFlags, 3n);

	builder.addExecSegFlags(4n);
	assertEquals((await builder.build()).execSegFlags, 7n);
});

Deno.test('specialSlot', async () => {
	const builder = new CodeDirectoryBuilder(kSecCodeSignatureHashSHA1);
	builder.executable(new Blob([]), 0, 0, 0);
	const zero = (await builder.build()).length;
	assertThrows(() => builder.specialSlot(0, new ArrayBuffer(0)));
	assertEquals((await builder.build()).length, zero + CS_SHA1_LEN * 0);

	await builder.specialSlot(1, new ArrayBuffer(0));
	assertEquals((await builder.build()).length, zero + CS_SHA1_LEN * 1);
});

Deno.test('createScatter', async () => {
	const builder = new CodeDirectoryBuilder(kSecCodeSignatureHashSHA1);
	builder.executable(new Blob([]), 0, 0, 0);
	assertEquals(builder.scatter(), null);

	let scatter = builder.scatter(NaN);
	assertEquals(scatter.length, 1);

	scatter = builder.scatter(2);
	scatter[0].count = 1;
	scatter[1].count = 2;
	assertEquals(scatter.length, 3);
	await builder.build();
});

Deno.test('version and size', () => {
	let size = 0;
	const builder = new CodeDirectoryBuilder(kSecCodeSignatureHashSHA1);
	builder.executable(new Blob([new Uint8Array(1)]), 1024, 0, 1);

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

	builder.reopen(new Blob([]), 0, UINT32_MAX + 1);
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
});

Deno.test('platform', async () => {
	const builder = new CodeDirectoryBuilder(kSecCodeSignatureHashSHA1);
	builder.executable(new Blob([]), 0, 0, 0);
	builder.platform(PLATFORM_MACOS);
	assertEquals((await builder.build()).platform, PLATFORM_MACOS);
});

Deno.test('generatePreEncryptHashes', async () => {
	const version = CodeDirectory.supportsPreEncrypt;
	const builder = new CodeDirectoryBuilder(kSecCodeSignatureHashSHA1);
	builder.executable(new Blob([new Uint8Array(1)]), 0, 0, 1);
	const zero = (await builder.build(version)).length;

	builder.generatePreEncryptHashes(true);
	assertEquals((await builder.build(version)).length, zero + CS_SHA1_LEN * 1);
});

Deno.test('Read valiation', async () => {
	const builder = new CodeDirectoryBuilder(kSecCodeSignatureHashSHA1);
	builder.executable(new Blob([]), 1024, 0, UINT32_MAX + 1);
	await assertRejects(() => builder.build(), Error, 'Read from 0');
});
