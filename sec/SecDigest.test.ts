import { assertEquals } from '@std/assert';
import { SecSHA1DigestCreate, SecSHA256DigestCreate } from './SecDigest.ts';
import { INT32_MAX } from '../libc/stdint.ts';
import { digest } from '../spec/hash.ts';

export const ABCD = new Uint8Array([...'ABCD'].map((c) => c.charCodeAt(0)));

Deno.test('SecSHA1DigestCreate', async () => {
	assertEquals(
		await SecSHA1DigestCreate(
			{ buffer: new ArrayBuffer(), byteOffset: 0 },
			-1,
		),
		null,
	);
	assertEquals(
		await SecSHA1DigestCreate(
			{ buffer: new ArrayBuffer(), byteOffset: 0 },
			INT32_MAX + 1,
		),
		null,
	);
	assertEquals(await SecSHA1DigestCreate(null, 0), null);

	assertEquals(
		await SecSHA1DigestCreate(ABCD, ABCD.byteLength),
		digest('sha1', ABCD),
	);
});

Deno.test('SecSHA256DigestCreate', async () => {
	assertEquals(
		await SecSHA1DigestCreate(
			{ buffer: new ArrayBuffer(), byteOffset: 0 },
			-1,
		),
		null,
	);
	assertEquals(
		await SecSHA256DigestCreate(
			{ buffer: new ArrayBuffer(), byteOffset: 0 },
			INT32_MAX + 1,
		),
		null,
	);
	assertEquals(await SecSHA256DigestCreate(null, 0), null);

	assertEquals(
		await SecSHA256DigestCreate(ABCD, ABCD.byteLength),
		digest('sha256', ABCD),
	);
});
