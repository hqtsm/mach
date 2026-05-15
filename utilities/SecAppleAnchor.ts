import type { SubtleCryptoDigest } from '../helpers/crypto.ts';
import { type ArrayBufferLikeData, viewBytes } from '../helpers/memory.ts';
import type { bool } from '../libc/c.ts';
import { SecCertificateCopyIssuerSHA256Digest } from '../sec/SecCertificate.ts';
import type { SecCertificateRef } from '../Security/SecBase.ts';
import type { SecAppleTrustAnchorFlags } from './SecAppleAnchorPriv.ts';

/**
 * Check if certificate is an Apple trust anchor.
 *
 * @param cert Certificate.
 * @param flags Flags (unused).
 * @param subtle Hash crypto.
 * @returns True if certificate is an Apple trust anchor, else false.
 */
export async function SecIsAppleTrustAnchor(
	cert: SecCertificateRef,
	flags: SecAppleTrustAnchorFlags,
	subtle?: SubtleCryptoDigest | null,
): Promise<bool> {
	const data = await SecCertificateCopyIssuerSHA256Digest(cert, subtle);
	return data ? SecIsAppleTrustAnchorData(data, flags) : false;
}

/**
 * Check if certificate is an Apple trust anchor, by hash.
 *
 * @param cert Certificate hash.
 * @param flags Flags (unused).
 * @returns True if certificate is an Apple trust anchor, else false.
 */
export function SecIsAppleTrustAnchorData(
	cert: ArrayBufferLikeData,
	flags: SecAppleTrustAnchorFlags,
): bool {
	void flags;
	const anchors = getAnchors();
	const d = viewBytes(cert);
	const l = d.byteLength;
	if (l !== 32) {
		return false;
	}
	let hash = '';
	for (let i = 0; i < l;) {
		hash += d[i++].toString(16).padStart(2, '0');
	}
	return anchors[hash] ?? false;
}

/*
 * Apple Root CA hash.
 */
const AppleRootCAHash =
	'b0b1730ecbc7ff4505142c49f1295e6eda6bcaed7e2c68c5be91b5a11001f024';

/**
 * Apple Root CA G2 hash.
 */
const AppleRootG2Hash =
	'c2b9b042dd57830e7d117dac55ac8ae19407d38e41d88f3215bc3a890444a050';

/**
 * Apple Root CA G3 hash.
 */
const AppleRootG3Hash =
	'63343abfb89a6a03ebb57e9b3f5fa7be7c4f5c756f3017b3a8c488c3653e9179';

/**
 * Apple Platform Backport RSA Root G1 hash.
 */
const ApplePlatformBackportRSARootG1Hash =
	'fb3f6cf69467b5fa9ffa2b3b392b6e5e775bbb09c77b6e759e9038e26bbf9049';

/**
 * Apple Platform Backport ECC Root G1 hash.
 */
const ApplePlatformBackportECCRootG1Hash =
	'eda23b3f224f45e0952f20e4d2b33e000d49c8044c1168de47b443cd2b3536dc';

/**
 * Apple Platform Bootstrap RSA Root G1 hash.
 */
const ApplePlatformBootstrapECCRootG1_hash =
	'5fbd45b0303b6247e410328864b795bf91f44856be6cbd8d1949ff60a6f51908';

let anchors: Readonly<Record<string, bool>>;

function getAnchors(): Readonly<Record<string, bool>> {
	return anchors ??= {
		[AppleRootCAHash]: true,
		[AppleRootG2Hash]: true,
		[AppleRootG3Hash]: true,
		[ApplePlatformBackportRSARootG1Hash]: true,
		[ApplePlatformBackportECCRootG1Hash]: true,
		[ApplePlatformBootstrapECCRootG1_hash]: true,
	};
}
