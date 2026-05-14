import type { ArrayBufferPointer } from '@hqtsm/struct';
import type { CFIndex } from '../CoreFoundation/CFBase.ts';
import {
	CC_SHA1_DIGEST_LENGTH,
	CC_SHA256_DIGEST_LENGTH,
	CCDigest,
} from '../CommonCrypto/CommonDigest.ts';
import {
	kCCDigestSHA1,
	kCCDigestSHA256,
} from '../CommonCrypto/Private/CommonDigestSPI.ts';
import { INT32_MAX } from '../libc/stdint.ts';
import type { SubtleCryptoDigest } from '../util/crypto.ts';

/**
 * SHA-1 digest.
 *
 * @param data Data pointer.
 * @param length Data length.
 * @param subtle Hash crypto.
 * @returns Digest.
 */
export async function SecSHA1DigestCreate(
	data: ArrayBufferPointer<ArrayBuffer> | null,
	length: CFIndex,
	subtle?: SubtleCryptoDigest | null,
): Promise<ArrayBuffer | null> {
	if (length < 0 || length > INT32_MAX || !data) {
		return null;
	}
	const digest = new ArrayBuffer(CC_SHA1_DIGEST_LENGTH);
	await CCDigest(kCCDigestSHA1, data, length, digest, subtle);
	return digest;
}

/**
 * SHA-256 digest.
 *
 * @param data Data pointer.
 * @param length Data length.
 * @param subtle Hash crypto.
 * @returns Digest.
 */
export async function SecSHA256DigestCreate(
	data: ArrayBufferPointer<ArrayBuffer> | null,
	length: CFIndex,
	subtle?: SubtleCryptoDigest | null,
): Promise<ArrayBuffer | null> {
	if (length < 0 || length > INT32_MAX || !data) {
		return null;
	}
	const digest = new ArrayBuffer(CC_SHA256_DIGEST_LENGTH);
	await CCDigest(kCCDigestSHA256, data, length, digest, subtle);
	return digest;
}
