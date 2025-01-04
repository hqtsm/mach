import { assertEquals, assertRejects } from '@std/assert';
import {
	kSecCodeSignatureHashSHA1,
	kSecCodeSignatureHashSHA256,
	kSecCodeSignatureHashSHA256Truncated,
	kSecCodeSignatureHashSHA384,
	kSecCodeSignatureHashSHA512,
} from '../const.ts';
import { chunkedHashes, hash } from './hash.ts';
import { hex, unhex } from './hex.ts';

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
