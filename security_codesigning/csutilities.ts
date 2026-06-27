import {
	pointerBytes,
	type Reader,
	type SubtleCryptoDigest,
} from '../helpers/mod.ts';
import type { _const, bool, size_t } from '../libc/mod.ts';
import {
	type CSSM_OID,
	SecCertificateCopyExtensionValue,
	type SecCertificateRef,
} from '../Security/mod.ts';
import type { Security_DynamicHash } from '../security_utilities/mod.ts';
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
