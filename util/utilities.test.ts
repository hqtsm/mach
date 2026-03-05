import { assertEquals } from '@std/assert';
import { kCCDigestSHA1 } from '../const.ts';
import { CCHashInstance } from '../hash/cchashinstance.ts';
import { hashFileData } from './utilities.ts';

Deno.test('hashFileData full', async () => {
	const data = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]);
	const expected = new Uint8Array(
		await crypto.subtle.digest('SHA-1', data),
	);

	const hasher = new CCHashInstance(kCCDigestSHA1);
	const size = await hashFileData(new Blob([data]), hasher);
	assertEquals(size, 8);
	const digest = new Uint8Array(hasher.digestLength());
	await hasher.finish(digest);

	assertEquals(digest, expected);
});

Deno.test('hashFileData limit', async () => {
	const data = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]);
	const expected = new Uint8Array(
		await crypto.subtle.digest('SHA-1', data.slice(0, 4)),
	);

	const hasher = new CCHashInstance(kCCDigestSHA1);
	const size = await hashFileData(new Blob([data]), hasher, 4);
	assertEquals(size, 4);
	const digest = new Uint8Array(hasher.digestLength());
	await hasher.finish(digest);

	assertEquals(digest, expected);
});
