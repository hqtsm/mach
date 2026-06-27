import type { ArrayBufferPointer } from '@hqtsm/struct';
import {
	pointerBytes,
	pointerToBytes,
	type Reader,
	type SubtleCryptoDigest,
} from '../helpers/mod.ts';
import type { _const, bool, size_t } from '../libc/mod.ts';
import {
	type CSSM_OID,
	SecCertificateCopyExtensionValue,
	SecCertificateGetBytePtr,
	SecCertificateGetLength,
	type SecCertificateRef,
} from '../Security/mod.ts';
import {
	type Security_DynamicHash,
	Security_SHA1,
} from '../security_utilities/mod.ts';
import {
	type SecAppleTrustAnchorFlags,
	SecIsAppleTrustAnchor,
} from '../utilities/mod.ts';

/**
 * Check if a certificate is an Apple CA.
 *
 * @param cert Certificate.
 * @param subtle Hash crypto.
 * @returns True if certificate is an Apple CA, else false.
 */
export async function Security_CodeSigning_isAppleCA(
	cert: SecCertificateRef,
	subtle?: SubtleCryptoDigest | null,
): Promise<bool> {
	const flags: SecAppleTrustAnchorFlags = 0;
	/*
	// Always false:
	if (SecIsInternalRelease() || SecAreQARootCertificatesEnabled()) {
		flags |= kSecAppleTrustAnchorFlagsIncludeTestAnchors;
		flags |= kSecAppleTrustAnchorFlagsAllowNonProduction;
	}
	*/
	return await SecIsAppleTrustAnchor(cert, flags, subtle);
}

/**
 * Hash certificate data.
 *
 * @param certData Certificate data.
 * @param certLength Certificate length.
 * @param digest SHA-1 digest.
 */
export async function Security_CodeSigning_hashOfCertificate(
	certData: ArrayBufferPointer,
	certLength: size_t,
	digest: ArrayBufferLike | ArrayBufferPointer,
): Promise<void>;

/**
 * Hash certificate data.
 *
 * @param cert Certificate.
 * @param digest SHA-1 digest.
 */
export async function Security_CodeSigning_hashOfCertificate(
	cert: SecCertificateRef,
	digest: ArrayBufferLike | ArrayBufferPointer,
): Promise<void>;

/**
 * Hash certificate data.
 *
 * @param certData Certificate data.
 * @param certLength Certificate length or SHA-1 digest.
 * @param digest SHA-1 digest.
 */
export async function Security_CodeSigning_hashOfCertificate(
	certData: ArrayBufferPointer | SecCertificateRef,
	certLength: size_t | ArrayBufferLike | ArrayBufferPointer,
	digest?: ArrayBufferLike | ArrayBufferPointer,
): Promise<void> {
	if (typeof certLength === 'number') {
		const sha1 = new Security_SHA1();
		await sha1.update(
			pointerToBytes(certData as ArrayBufferPointer, certLength),
		);
		await sha1.finish(digest!);
	} else {
		await Security_CodeSigning_hashOfCertificate(
			SecCertificateGetBytePtr(certData as SecCertificateRef)!,
			SecCertificateGetLength(certData as SecCertificateRef),
			certLength,
		);
	}
}

/**
 * Hash file data.
 *
 * @param reader Reader.
 * @param hasher Hasher.
 * @param limit Limit.
 * @returns Size.
 */
export async function Security_CodeSigning_hashFileData(
	reader: Reader,
	hasher: Security_DynamicHash,
	limit: size_t = 0,
): Promise<size_t> {
	await hasher.update(reader = limit ? reader.slice(0, limit) : reader);
	return reader.size;
}

/**
 * Check if certificate has a field, by OID.
 *
 * @param cert Certificate.
 * @param oid OID.
 * @returns True if certificate has field, else false.
 */
export function Security_CodeSigning_certificateHasField(
	cert: SecCertificateRef | null,
	oid: _const<CSSM_OID>,
): bool {
	return !!(cert && SecCertificateCopyExtensionValue(
		cert,
		pointerBytes(oid.Data!, oid.Length),
		null,
	));
}
