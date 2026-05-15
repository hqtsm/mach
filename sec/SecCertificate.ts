import { toStringTag } from '@hqtsm/class';
import { Int32Ptr, type Ptr } from '@hqtsm/struct';
import type { CFIndex } from '../CoreFoundation/CFBase.ts';
import type { SubtleCryptoDigest } from '../helpers/crypto.ts';
import { bufferBytes } from '../helpers/memory.ts';
import type { bool } from '../libc/c.ts';
import { INT32_MAX, type int32_t } from '../libc/stdint.ts';
import type { DERItem } from '../libDER/DERItem.ts';
import type { SecCertificateRef } from '../Security/SecBase.ts';
import { SecSHA1DigestCreate, SecSHA256DigestCreate } from './SecDigest.ts';

/**
 * X.509 certificate extension.
 */
export class SecCertificateExtension {
	/**
	 * Extension ID.
	 */
	public extnID: DERItem | null = null;

	/**
	 * Critical flag.
	 */
	public critical: bool = false;

	/**
	 * Extension value.
	 */
	public extnValue: DERItem | null = null;

	static {
		toStringTag(this, 'SecCertificateExtension');
	}
}

// enum {

/**
 * Self-signed: unknown.
 */
export const kSecSelfSignedUnknown = 0;

/**
 * Self-signed: false.
 */
export const kSecSelfSignedFalse = 1;

/**
 * Self-signed: true.
 */
export const kSecSelfSignedTrue = 2;

// }

/**
 * X.509 certificate.
 */
export class __SecCertificate {
	/**
	 * Entire certificate, DER format.
	 */
	public _der: DERItem | null = null;

	/**
	 * Number of certificate extensions.
	 */
	public _extensionCount: CFIndex = 0;

	/**
	 * Certificate extensions.
	 */
	public _extensions: SecCertificateExtension[] | null = null;

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

/**
 * Get decimal value of string.
 *
 * @param string String.
 * @param value Value.
 * @returns True if valid, else false.
 */
export function GetDecimalValueOfString(
	string: string,
	value: Ptr<int32_t>,
): bool {
	if (string && /^[0-9]+$/.test(string)) {
		value[0] = +string | 0;
		return true;
	}
	return false;
}

/**
 * Check if OID string is valid.
 *
 * @param oid OID string.
 * @returns True if valid, else false.
 */
export function SecCertificateIsOidString(oid: string | null): bool {
	if (!oid || oid.length < 3 || /[^\d.]/.test(oid)) {
		return false;
	}
	const [a, b] = oid;
	return b === '.' && (a === '0' || a === '1' || a === '2');
}

/**
 * Encode OID from string.
 *
 * @param string OID string.
 * @returns OID encoded bytes.
 */
export function SecCertificateCreateOidDataFromString(
	string: string,
): Uint8Array<ArrayBuffer> | null {
	if (!string || !SecCertificateIsOidString(string)) {
		return null;
	}

	const parts = string.split('.');
	const count = parts.length;
	const xp = new Int32Ptr(new ArrayBuffer(4));

	GetDecimalValueOfString(parts[0], xp);
	let x = xp[0] * 40;

	let i;
	if (!GetDecimalValueOfString(parts[1], xp) || (i = xp[0]) > 39) {
		return null;
	}

	const bytes = [x + i];
	const b = new Uint8Array(5);
	for (i = 2; i < count && GetDecimalValueOfString(parts[i], xp); i++) {
		x = xp[0];
		b[4] = x & 0x7F;
		b[3] = 0x80 | ((x >> 7) & 0x7F);
		b[2] = 0x80 | ((x >> 14) & 0x7F);
		b[1] = 0x80 | ((x >> 21) & 0x7F);
		b[0] = 0x80 | ((x >> 28) & 0x7F);

		for (x = 0; b[x] === 0x80; x++);
		bytes.push(...b.slice(x));
	}

	return new Uint8Array(bytes);
}
