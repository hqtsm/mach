import type { SubtleCryptoDigest } from '../../helpers/crypto.ts';
import type { Reader } from '../../helpers/reader.ts';
import type { bool } from '../../libc/c.ts';
import type { size_t } from '../../libc/stddef.ts';
import type { DynamicHash } from '../../Security/hashing.ts';
import { SecIsAppleTrustAnchor } from '../../utilities/SecAppleAnchor.ts';
import type {
	SecAppleTrustAnchorFlags,
} from '../../utilities/SecAppleAnchorPriv.ts';
import type { SecCertificateRef } from '../SecBase.ts';

/**
 * Check if a certificate is an Apple CA.
 *
 * @param cert Certificate.
 * @param subtle Hash crypto.
 * @returns True if certificate is an Apple CA, else false.
 */
export async function isAppleCA(
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
export async function hashFileData(
	reader: Reader,
	hasher: DynamicHash,
	limit: size_t = 0,
): Promise<size_t> {
	await hasher.update(reader = limit ? reader.slice(0, limit) : reader);
	return reader.size;
}
