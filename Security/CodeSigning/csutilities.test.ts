import { assertEquals } from '@std/assert';
import { kCCDigestSHA1 } from '../../CommonCrypto/Private/CommonDigestSPI.ts';
import { __SecCertificate } from '../../sec/SecCertificate.ts';
import { CCHashInstance } from '../../Security/hashing.ts';
import { unhex } from '../../spec/hex.ts';
import { hashFileData, isAppleCA } from './csutilities.ts';

const AppleRootCAHash =
	'b0b1730ecbc7ff4505142c49f1295e6eda6bcaed7e2c68c5be91b5a11001f024';

Deno.test('isAppleCA', async () => {
	assertEquals(await isAppleCA(new __SecCertificate()), false);
	assertEquals(
		await isAppleCA(
			Object.assign(new __SecCertificate(), {
				_der: new Uint8Array(100),
			}),
			{
				/**
				 * Return specific hash.
				 *
				 * @returns Promise.
				 */
				digest(): Promise<ArrayBuffer> {
					return Promise.resolve(unhex(AppleRootCAHash).buffer);
				},
			},
		),
		true,
	);
});

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
