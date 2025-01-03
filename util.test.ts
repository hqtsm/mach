import {
	assertEquals,
	assertRejects,
	assertStrictEquals,
	assertThrows,
} from '@std/assert';
import {
	chunkedHashes,
	fixtureMacho,
	graceful,
	hash,
	hex,
	indexOf,
	machoThin,
	unhex,
} from './util.spec.ts';
import { alignUp } from './util.ts';
import {
	kSecCodeSignatureHashSHA1,
	kSecCodeSignatureHashSHA256,
	kSecCodeSignatureHashSHA256Truncated,
	kSecCodeSignatureHashSHA384,
	kSecCodeSignatureHashSHA512,
} from './const.ts';

Deno.test('graceful', () => {
	assertStrictEquals(graceful(() => 1), 1);
	assertStrictEquals(
		graceful(() => {
			throw new Error('Test');
		}),
		null,
	);
});

Deno.test('indexOf', () => {
	assertEquals(indexOf(new Uint8Array(1), new Uint8Array(1)), 0);
	assertEquals(indexOf(new Uint8Array(0), new Uint8Array(0)), -1);
});

Deno.test('hash', async () => {
	const hashes = new Map([
		[
			kSecCodeSignatureHashSHA1,
			'da39a3ee5e6b4b0d3255bfef95601890afd80709',
		],
		[
			kSecCodeSignatureHashSHA256Truncated,
			'e3b0c44298fc1c149afbf4c8996fb92427ae41e4',
		],
		[
			kSecCodeSignatureHashSHA256,
			'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
		],
		[
			kSecCodeSignatureHashSHA384,
			'38b060a751ac96384cd9327eb1b1e36a21fdb71114be0743' +
			'4c0cc7bf63f6e1da274edebfe76f65fbd51ad2f14898b95b',
		],
		[
			kSecCodeSignatureHashSHA512,
			'cf83e1357eefb8bdf1542850d66d8007d620e4050b5715dc83f4a921d36ce9ce' +
			'47d0d13c5d85f2b0ff8318d2877eec2f63b931bd47417a81a538327af927da3e',
		],
	]);
	const hashed = await Promise.all([...hashes.keys()]
		.map(async (
			hashType,
		) => [
			hashType,
			hex(await hash(hashType, new Uint8Array())),
		] as const));
	for (const [hashType, hash] of hashed) {
		assertEquals(hashes.get(hashType), hash, `hashType: ${hashType}`);
	}
	assertRejects(async () => await hash(0, new Uint8Array(0)));
});

Deno.test('chunkedHashes', async () => {
	const chunkes = await chunkedHashes(
		kSecCodeSignatureHashSHA1,
		new Uint8Array(1),
		0,
	);
	assertEquals(chunkes, [unhex('5ba93c9db0cff93f52b521d7420e43f6eda2784f')]);
});

Deno.test('fixtureMacho', async () => {
	await fixtureMacho('app', 'arm64', [
		'u/Sample.app/Contents/Info.plist',
		'u/Sample.app/Contents/Frameworks/Sample.framework/Versions/Current',
	]);
});

Deno.test('machoThin', () => {
	assertThrows(() => machoThin(new Uint8Array(4), 0));
	assertEquals(
		machoThin(
			unhex(
				[
					'CA FE BA BE',
					'00 00 00 01',
					'00 00 00 01',
					'00 00 00 00',
					'00 00 00 00',
					'00 00 00 00',
					'00 00 00 00',
				].join(' '),
			),
			1,
		),
		new Uint8Array(),
	);
	assertEquals(
		machoThin(
			unhex(
				[
					'BE BA FE CA',
					'01 00 00 00',
					'01 00 00 00',
					'00 00 00 00',
					'00 00 00 00',
					'00 00 00 00',
					'00 00 00 00',
				].join(' '),
			),
			1,
		),
		new Uint8Array(),
	);
	assertEquals(
		machoThin(
			unhex(
				[
					'CA FE BA BF',
					'00 00 00 01',
					'00 00 00 01',
					'00 00 00 00',
					'00 00 00 00',
					'00 00 00 00',
					'00 00 00 00',
					'00 00 00 00',
					'00 00 00 00',
				].join(' '),
			),
			1,
		),
		new Uint8Array(),
	);
	assertEquals(
		machoThin(
			unhex(
				[
					'BF BA FE CA',
					'01 00 00 00',
					'01 00 00 00',
					'00 00 00 00',
					'00 00 00 00',
					'00 00 00 00',
					'00 00 00 00',
					'00 00 00 00',
					'00 00 00 00',
				].join(' '),
			),
			1,
		),
		new Uint8Array(),
	);
});

Deno.test('alignUp unsigned', () => {
	assertEquals(alignUp(0, 4), 0);
	assertEquals(alignUp(1, 4), 4);
	assertEquals(alignUp(2, 4), 4);
	assertEquals(alignUp(3, 4), 4);
	assertEquals(alignUp(4, 4), 4);
	assertEquals(alignUp(5, 4), 8);
	assertEquals(alignUp(6, 4), 8);
	assertEquals(alignUp(7, 4), 8);
	assertEquals(alignUp(8, 4), 8);
	assertEquals(alignUp(9, 4), 12);
	assertEquals(alignUp(10, 4), 12);
	assertEquals(alignUp(11, 4), 12);
	assertEquals(alignUp(12, 4), 12);
	assertEquals(alignUp(13, 4), 16);
	assertEquals(alignUp(14, 4), 16);
	assertEquals(alignUp(15, 4), 16);
	assertEquals(alignUp(16, 4), 16);
	assertEquals(alignUp(17, 4), 20);
	assertEquals(alignUp(18, 4), 20);
	assertEquals(alignUp(19, 4), 20);
	assertEquals(alignUp(20, 4), 20);
});
