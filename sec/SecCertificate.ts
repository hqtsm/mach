import { toStringTag } from '@hqtsm/class';
import type { SubtleCryptoDigest } from '../helpers/crypto.ts';
import { bufferBytes } from '../helpers/memory.ts';
import { INT32_MAX } from '../libc/stdint.ts';
import type { DERItem } from '../libDER/DERItem.ts';
import type { SecCertificateRef } from '../Security/SecBase.ts';
import { SecSHA1DigestCreate, SecSHA256DigestCreate } from './SecDigest.ts';

/**
 * X.509 certificate.
 */
export class __SecCertificate {
	/**
	 * Entire certificate, DER format.
	 */
	public _der: DERItem | null = null;

	static {
		toStringTag(this, '__SecCertificate');
	}
}

/**
 * Get SHA-1 digest for certificate.
 *
 * @param certificate Certificate.
 * @param subtle Hash crypto.
 * @returns Digest.
 */
export async function SecCertificateCopySHA1Digest(
	certificate: SecCertificateRef | null,
	subtle?: SubtleCryptoDigest | null,
): Promise<null | ArrayBuffer> {
	let der;
	if (
		!certificate ||
		!(der = certificate._der) ||
		der.byteLength > INT32_MAX
	) {
		return null;
	}
	return await SecSHA1DigestCreate(
		bufferBytes(der.buffer, der.byteOffset, der.byteLength),
		der.byteLength,
		subtle,
	);
}

/**
 * Get SHA-256 digest for certificate.
 *
 * @param certificate Certificate.
 * @param subtle Hash crypto.
 * @returns Digest.
 */
export async function SecCertificateCopyIssuerSHA256Digest(
	certificate: SecCertificateRef | null,
	subtle?: SubtleCryptoDigest | null,
): Promise<null | ArrayBuffer> {
	let der;
	if (
		!certificate ||
		!(der = certificate._der) ||
		der.byteLength > INT32_MAX
	) {
		return null;
	}
	return await SecSHA256DigestCreate(
		bufferBytes(der.buffer, der.byteOffset, der.byteLength),
		der.byteLength,
		subtle,
	);
}
