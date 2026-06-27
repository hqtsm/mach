import { Uint8Ptr } from '@hqtsm/struct';
import {
	APPLE_ADS_OID,
	APPLE_ALG_OID,
	APPLE_CERT_POLICIES,
	APPLE_EKU_CODE_SIGNING,
	APPLE_EKU_OID,
	GOOGLE_EMBEDDED_SCT_OID,
	GOOGLE_OCSP_SCT_OID,
	NETSCAPE_CERT_EXTEN,
	NETSCAPE_CERT_POLICY,
	OID_AD,
	OID_AD_OCSP,
	OID_ANSI_X9_62,
	OID_ATTR_TYPE,
	OID_CERTICOM,
	OID_DOD,
	OID_EXTENSION,
	OID_KP,
	OID_NIST_HASHALG,
	OID_OIW_ALGORITHM,
	OID_PE,
	OID_PKCS_1,
	OID_PKCS_9,
	OID_QT,
	OID_RSA_HASH,
	OID_US,
} from '../Security/mod.ts';
import { DERItem } from './DERItem.ts';

const OID_PUBLIC_KEY_TYPE = [...OID_ANSI_X9_62, 2] as const;
const OID_EC_CURVE = [...OID_ANSI_X9_62, 3, 1] as const;
const OID_EC_SIG_TYPE = [...OID_ANSI_X9_62, 4] as const;
const OID_ECDSA_WITH_SHA2 = [...OID_EC_SIG_TYPE, 3] as const;

const OID_CERTICOM_EC_CURVE = [...OID_CERTICOM, 0] as const;

const OID_ANSI_X9_57 = [...OID_US, 206, 56] as const;
const OID_ANSI_X9_57_ALGORITHM = [...OID_ANSI_X9_57, 4] as const;

const OID_IANA = [...OID_DOD, 1, 5] as const;

const OID_MECHANISMS = [...OID_IANA, 5] as const;

const OID_AD_CAISSUERS = [...OID_AD, 2] as const;

const OID_ISAKMP = [...OID_MECHANISMS, 8] as const;

const APPLE_EKU_APPLE_ID = [...APPLE_EKU_OID, 7] as const;
const APPLE_EKU_PASSBOOK = [...APPLE_EKU_OID, 14] as const;
const APPLE_EKU_PROFILE_SIGNING = [...APPLE_EKU_OID, 16] as const;
const APPLE_EKU_QA_PROFILE_SIGNING = [...APPLE_EKU_OID, 17] as const;

const APPLE_CERT_POLICY_MOBILE_STORE = [...APPLE_CERT_POLICIES, 12] as const;

const APPLE_CERT_POLICY_MOBILE_STORE_PRODQA = [
	...APPLE_CERT_POLICY_MOBILE_STORE,
	1,
] as const;

const APPLE_CERT_EXT = [...APPLE_ADS_OID, 6] as const;

const APPLE_CERT_EXT_INTERMEDIATE_MARKER = [...APPLE_CERT_EXT, 2] as const;

const APPLE_CERT_EXT_INTERMEDIATE_MARKER_WWDR = [
	...APPLE_CERT_EXT_INTERMEDIATE_MARKER,
	1,
] as const;

const APPLE_CERT_EXT_INTERMEDIATE_MARKER_APPLEID = [
	...APPLE_CERT_EXT_INTERMEDIATE_MARKER,
	3,
] as const;

const APPLE_CERT_EXT_INTERMEDIATE_MARKER_APPLEID_2 = [
	...APPLE_CERT_EXT_INTERMEDIATE_MARKER,
	7,
] as const;

const APPLE_CERT_EXT_INTERMEDIATE_MARKER_APPLEID_SYSTEM_INTEGRATION_2 = [
	...APPLE_CERT_EXT_INTERMEDIATE_MARKER,
	10,
] as const;

const APPLE_CERT_EXT_INTERMEDIATE_MARKER_APPLEID_SYSTEM_INTEGRATION_G3 = [
	...APPLE_CERT_EXT_INTERMEDIATE_MARKER,
	13,
] as const;

const APPLE_CERT_EXT_APPLE_PUSH_MARKER = [
	...APPLE_CERT_EXT_INTERMEDIATE_MARKER_APPLEID,
	2,
] as const;

const APPLE_CERT_EXTENSION_CODESIGNING = [...APPLE_CERT_EXT, 1] as const;

const APPLE_SBOOT_CERT_EXTEN_SBOOT_SPEC_OID = [
	...APPLE_CERT_EXTENSION_CODESIGNING,
	1,
] as const;
const APPLE_SBOOT_CERT_EXTEN_SBOOT_TICKET_SPEC_OID = [
	...APPLE_CERT_EXTENSION_CODESIGNING,
	11,
] as const;
const APPLE_SBOOT_CERT_EXTEN_IMG4_MANIFEST_SPEC_OID = [
	...APPLE_CERT_EXTENSION_CODESIGNING,
	15,
] as const;

const APPLE_PROVISIONING_PROFILE_OID = [
	...APPLE_CERT_EXT_INTERMEDIATE_MARKER,
	1,
] as const;

const APPLE_APP_SIGNING_OID = [...APPLE_CERT_EXTENSION_CODESIGNING, 3] as const;

const APPLE_INSTALLER_PACKAGE_SIGNING_EXTERNAL_OID = [
	...APPLE_CERT_EXTENSION_CODESIGNING,
	16,
] as const;

const APPLE_TVOS_APP_SIGNING_PROD_OID = [
	...APPLE_CERT_EXTENSION_CODESIGNING,
	24,
] as const;

const APPLE_TVOS_APP_SIGNING_PRODQA_OID = [
	...APPLE_CERT_EXTENSION_CODESIGNING,
	24,
	1,
] as const;

const APPLE_ESCROW_ARC = [...APPLE_CERT_EXT, 23] as const;

const APPLE_ESCROW_POLICY_OID = [...APPLE_ESCROW_ARC, 1] as const;

const APPLE_CERT_EXT_APPLE_ID_VALIDATION_RECORD_SIGNING = [
	...APPLE_CERT_EXT,
	25,
] as const;

const APPLE_SERVER_AUTHENTICATION = [...APPLE_CERT_EXT, 27];
const APPLE_CERT_EXT_APPLE_SERVER_AUTHENTICATION = [
	...APPLE_SERVER_AUTHENTICATION,
	1,
];
const APPLE_CERT_EXT_APPLE_SERVER_AUTHENTICATION_PPQ_PRODQA = [
	...APPLE_SERVER_AUTHENTICATION,
	3,
	1,
];
const APPLE_CERT_EXT_APPLE_SERVER_AUTHENTICATION_PPQ_PROD = [
	...APPLE_SERVER_AUTHENTICATION,
	3,
	2,
];
const APPLE_CERT_EXT_APPLE_SERVER_AUTHENTICATION_IDS_PRODQA = [
	...APPLE_SERVER_AUTHENTICATION,
	4,
	1,
];
const APPLE_CERT_EXT_APPLE_SERVER_AUTHENTICATION_IDS_PROD = [
	...APPLE_SERVER_AUTHENTICATION,
	4,
	2,
];
const APPLE_CERT_EXT_APPLE_SERVER_AUTHENTICATION_APN_PRODQA = [
	...APPLE_SERVER_AUTHENTICATION,
	5,
	1,
];
const APPLE_CERT_EXT_APPLE_SERVER_AUTHENTICATION_APN_PROD = [
	...APPLE_SERVER_AUTHENTICATION,
	5,
	2,
];

const APPLE_CERT_EXT_APPLE_SERVER_AUTHENTICATION_GS = [
	...APPLE_SERVER_AUTHENTICATION,
	2,
];

const APPLE_CERT_EXT_INTERMEDIATE_MARKER_APPLE_SERVER_AUTHENTICATION = [
	...APPLE_CERT_EXT_INTERMEDIATE_MARKER,
	12,
] as const;

const APPLE_CERT_EXT_APPLE_SMP_ENCRYPTION = [...APPLE_CERT_EXT, 30] as const;

const APPLE_CERT_EXT_APPLE_PPQ_SIGNING_PRODQA = [
	...APPLE_CERT_EXT,
	38,
	1,
] as const;
const APPLE_CERT_EXT_APPLE_PPQ_SIGNING_PROD = [
	...APPLE_CERT_EXT,
	38,
	2,
] as const;

const APPLE_ATV_APP_SIGNING_OID = [
	...APPLE_CERT_EXTENSION_CODESIGNING,
	24,
] as const;
const APPLE_ATV_APP_SIGNING_OID_PRODQA = [
	...APPLE_ATV_APP_SIGNING_OID,
	1,
] as const;

const APPLE_CERT_EXT_CRYPTO_SERVICES_EXT_ENCRYPTION = [
	...APPLE_CERT_EXT,
	39,
] as const;

const APPLE_CERT_EXT_OSX_PROVISIONING_PROFILE_SIGNING = [
	...APPLE_EKU_OID,
	11,
] as const;

const APPLE_CERT_EXT_APPLE_ATV_VPN_PROFILE_SIGNING = [
	...APPLE_CERT_EXT,
	43,
] as const;

const APPLE_CERT_EXT_AST2_DIAGNOSTICS_SERVER_AUTH_PRODQA = [
	...APPLE_SERVER_AUTHENTICATION,
	8,
	1,
] as const;
const APPLE_CERT_EXT_AST2_DIAGNOSTICS_SERVER_AUTH_PROD = [
	...APPLE_SERVER_AUTHENTICATION,
	8,
	2,
] as const;

const APPLE_CERT_EXT_ESCROW_PROXY_SERVER_AUTH_PRODQA = [
	...APPLE_SERVER_AUTHENTICATION,
	7,
	1,
] as const;
const APPLE_CERT_EXT_ESCROW_PROXY_SERVER_AUTH_PROD = [
	...APPLE_SERVER_AUTHENTICATION,
	7,
	2,
] as const;

const APPLE_CERT_EXT_FMIP_SERVER_AUTH_PRODQA = [
	...APPLE_SERVER_AUTHENTICATION,
	6,
	1,
] as const;
const APPLE_CERT_EXT_FMIP_SERVER_AUTH_PROD = [
	...APPLE_SERVER_AUTHENTICATION,
	6,
	2,
] as const;

const APPLE_CERT_EXT_INTERMEDIATE_MARKER_APPLE_HOME_KIT_SERVER_AUTH = [
	...APPLE_CERT_EXT_INTERMEDIATE_MARKER,
	16,
] as const;
const APPLE_CERT_EXT_HOME_KIT_SERVER_AUTH = [
	...APPLE_SERVER_AUTHENTICATION,
	9,
] as const;

const APPLE_CERT_EXT_MMCS_SERVER_AUTH_PRODQA = [
	...APPLE_SERVER_AUTHENTICATION,
	11,
	1,
] as const;
const APPLE_CERT_EXT_MMCS_SERVER_AUTH_PROD = [
	...APPLE_SERVER_AUTHENTICATION,
	11,
	2,
] as const;

const APPLE_CERT_EXT_ICLOUD_SETUP_SERVER_AUTH_PRODQA = [
	...APPLE_SERVER_AUTHENTICATION,
	15,
	1,
] as const;
const APPLE_CERT_EXT_ICLOUD_SETUP_SERVER_AUTH_PROD = [
	...APPLE_SERVER_AUTHENTICATION,
	15,
	2,
] as const;

const ENTRUST_BASE_OID = [...OID_US, 0x86, 0xf6, 0x7d] as const;

const ENTRUST_CERT_EXTEN = [...ENTRUST_BASE_OID, 0x07, 0x41] as const;

const MICROSOFT_BASE_OID = [...OID_DOD, 0x01, 0x04, 0x01, 0x82, 0x37] as const;
const MICROSOFT_ENROLLMENT_OID = [...MICROSOFT_BASE_OID, 0x14] as const;

// Algorithm OIDs:

const _oidRsa = [...OID_PKCS_1, 1] as const;
const _oidMd2Rsa = [...OID_PKCS_1, 2] as const;
const _oidMd4Rsa = [...OID_PKCS_1, 3] as const;
const _oidMd5Rsa = [...OID_PKCS_1, 4] as const;
const _oidSha1Rsa = [...OID_PKCS_1, 5] as const;
const _oidSha256Rsa = [...OID_PKCS_1, 11] as const;
const _oidSha384Rsa = [...OID_PKCS_1, 12] as const;
const _oidSha512Rsa = [...OID_PKCS_1, 13] as const;
const _oidSha224Rsa = [...OID_PKCS_1, 14] as const;
const _oidEcPubKey = [...OID_PUBLIC_KEY_TYPE, 1] as const;
const _oidSha1Ecdsa = [...OID_EC_SIG_TYPE, 1] as const;
const _oidSha224Ecdsa = [...OID_ECDSA_WITH_SHA2, 1] as const;
const _oidSha256Ecdsa = [...OID_ECDSA_WITH_SHA2, 2] as const;
const _oidSha384Ecdsa = [...OID_ECDSA_WITH_SHA2, 3] as const;
const _oidSha512Ecdsa = [...OID_ECDSA_WITH_SHA2, 4] as const;
const _oidSha1Dsa = [...OID_ANSI_X9_57_ALGORITHM, 3] as const;
const _oidMd2 = [...OID_RSA_HASH, 2] as const;
const _oidMd4 = [...OID_RSA_HASH, 4] as const;
const _oidMd5 = [...OID_RSA_HASH, 5] as const;
const _oidSha1 = [...OID_OIW_ALGORITHM, 26] as const;
const _oidSha1DsaOIW = [...OID_OIW_ALGORITHM, 27] as const;
const _oidSha1DsaCommonOIW = [...OID_OIW_ALGORITHM, 28] as const;
const _oidSha1RsaOIW = [...OID_OIW_ALGORITHM, 29] as const;
const _oidSha256 = [...OID_NIST_HASHALG, 1] as const;
const _oidSha384 = [...OID_NIST_HASHALG, 2] as const;
const _oidSha512 = [...OID_NIST_HASHALG, 3] as const;
const _oidSha224 = [...OID_NIST_HASHALG, 4] as const;
const _oidFee = [...APPLE_ALG_OID, 1] as const;
const _oidMd5Fee = [...APPLE_ALG_OID, 3] as const;
const _oidSha1Fee = [...APPLE_ALG_OID, 4] as const;
const _oidEcPrime192v1 = [...OID_EC_CURVE, 1] as const;
const _oidEcPrime256v1 = [...OID_EC_CURVE, 7] as const;
const _oidAnsip384r1 = [...OID_CERTICOM_EC_CURVE, 34] as const;
const _oidAnsip521r1 = [...OID_CERTICOM_EC_CURVE, 35] as const;

/**
 * OID: 1.2.840.113549.1.1.1
 */
export const oidRsa: DERItem = new DERItem(
	new Uint8Ptr(new Uint8Array(_oidRsa).buffer),
	_oidRsa.length,
);

/**
 * OID: 1.2.840.113549.1.1.2
 */
export const oidMd2Rsa: DERItem = new DERItem(
	new Uint8Ptr(new Uint8Array(_oidMd2Rsa).buffer),
	_oidMd2Rsa.length,
);

/**
 * OID: 1.2.840.113549.1.1.3
 */
export const oidMd4Rsa: DERItem = new DERItem(
	new Uint8Ptr(new Uint8Array(_oidMd4Rsa).buffer),
	_oidMd4Rsa.length,
);

/**
 * OID: 1.2.840.113549.1.1.4
 */
export const oidMd5Rsa: DERItem = new DERItem(
	new Uint8Ptr(new Uint8Array(_oidMd5Rsa).buffer),
	_oidMd5Rsa.length,
);

/**
 * OID: 1.2.840.113549.1.1.5
 */
export const oidSha1Rsa: DERItem = new DERItem(
	new Uint8Ptr(new Uint8Array(_oidSha1Rsa).buffer),
	_oidSha1Rsa.length,
);

/**
 * OID: 1.2.840.113549.1.1.11
 */
export const oidSha256Rsa: DERItem = new DERItem(
	new Uint8Ptr(new Uint8Array(_oidSha256Rsa).buffer),
	_oidSha256Rsa.length,
);

/**
 * OID: 1.2.840.113549.1.1.12
 */
export const oidSha384Rsa: DERItem = new DERItem(
	new Uint8Ptr(new Uint8Array(_oidSha384Rsa).buffer),
	_oidSha384Rsa.length,
);

/**
 * OID: 1.2.840.113549.1.1.13
 */
export const oidSha512Rsa: DERItem = new DERItem(
	new Uint8Ptr(new Uint8Array(_oidSha512Rsa).buffer),
	_oidSha512Rsa.length,
);

/**
 * OID: 1.2.840.113549.1.1.14
 */
export const oidSha224Rsa: DERItem = new DERItem(
	new Uint8Ptr(new Uint8Array(_oidSha224Rsa).buffer),
	_oidSha224Rsa.length,
);

/**
 * OID: 1.2.840.10045.2.1
 */
export const oidEcPubKey: DERItem = new DERItem(
	new Uint8Ptr(new Uint8Array(_oidEcPubKey).buffer),
	_oidEcPubKey.length,
);

/**
 * OID: 1.2.840.10045.4.1
 */
export const oidSha1Ecdsa: DERItem = new DERItem(
	new Uint8Ptr(new Uint8Array(_oidSha1Ecdsa).buffer),
	_oidSha1Ecdsa.length,
);

/**
 * OID: 1.2.840.10045.4.3.1
 */
export const oidSha224Ecdsa: DERItem = new DERItem(
	new Uint8Ptr(new Uint8Array(_oidSha224Ecdsa).buffer),
	_oidSha224Ecdsa.length,
);

/**
 * OID: 1.2.840.10045.4.3.2
 */
export const oidSha256Ecdsa: DERItem = new DERItem(
	new Uint8Ptr(new Uint8Array(_oidSha256Ecdsa).buffer),
	_oidSha256Ecdsa.length,
);

/**
 * OID: 1.2.840.10045.4.3.3
 */
export const oidSha384Ecdsa: DERItem = new DERItem(
	new Uint8Ptr(new Uint8Array(_oidSha384Ecdsa).buffer),
	_oidSha384Ecdsa.length,
);

/**
 * OID: 1.2.840.10045.4.3.4
 */
export const oidSha512Ecdsa: DERItem = new DERItem(
	new Uint8Ptr(new Uint8Array(_oidSha512Ecdsa).buffer),
	_oidSha512Ecdsa.length,
);

/**
 * OID: 1.2.840.10040.4.3
 */
export const oidSha1Dsa: DERItem = new DERItem(
	new Uint8Ptr(new Uint8Array(_oidSha1Dsa).buffer),
	_oidSha1Dsa.length,
);

/**
 * OID: 1.2.840.113549.2.2
 */
export const oidMd2: DERItem = new DERItem(
	new Uint8Ptr(new Uint8Array(_oidMd2).buffer),
	_oidMd2.length,
);

/**
 * OID: 1.2.840.113549.2.4
 */
export const oidMd4: DERItem = new DERItem(
	new Uint8Ptr(new Uint8Array(_oidMd4).buffer),
	_oidMd4.length,
);

/**
 * OID: 1.2.840.113549.2.5
 */
export const oidMd5: DERItem = new DERItem(
	new Uint8Ptr(new Uint8Array(_oidMd5).buffer),
	_oidMd5.length,
);

/**
 * OID: 1.3.14.3.2.26
 */
export const oidSha1: DERItem = new DERItem(
	new Uint8Ptr(new Uint8Array(_oidSha1).buffer),
	_oidSha1.length,
);

/**
 * OID: 1.3.14.3.2.29
 */
export const oidSha1RsaOIW: DERItem = new DERItem(
	new Uint8Ptr(new Uint8Array(_oidSha1RsaOIW).buffer),
	_oidSha1RsaOIW.length,
);

/**
 * OID: 1.3.14.3.2.27
 */
export const oidSha1DsaOIW: DERItem = new DERItem(
	new Uint8Ptr(new Uint8Array(_oidSha1DsaOIW).buffer),
	_oidSha1DsaOIW.length,
);

/**
 * OID: 1.3.14.3.2.28
 */
export const oidSha1DsaCommonOIW: DERItem = new DERItem(
	new Uint8Ptr(new Uint8Array(_oidSha1DsaCommonOIW).buffer),
	_oidSha1DsaCommonOIW.length,
);

/**
 * OID: 2.16.840.1.101.3.4.2.1
 */
export const oidSha256: DERItem = new DERItem(
	new Uint8Ptr(new Uint8Array(_oidSha256).buffer),
	_oidSha256.length,
);

/**
 * OID: 2.16.840.1.101.3.4.2.2
 */
export const oidSha384: DERItem = new DERItem(
	new Uint8Ptr(new Uint8Array(_oidSha384).buffer),
	_oidSha384.length,
);

/**
 * OID: 2.16.840.1.101.3.4.2.3
 */
export const oidSha512: DERItem = new DERItem(
	new Uint8Ptr(new Uint8Array(_oidSha512).buffer),
	_oidSha512.length,
);

/**
 * OID: 2.16.840.1.101.3.4.2.4
 */
export const oidSha224: DERItem = new DERItem(
	new Uint8Ptr(new Uint8Array(_oidSha224).buffer),
	_oidSha224.length,
);

/**
 * OID: 1.2.840.113635.100.2.1
 */
export const oidFee: DERItem = new DERItem(
	new Uint8Ptr(new Uint8Array(_oidFee).buffer),
	_oidFee.length,
);

/**
 * OID: 1.2.840.113635.100.2.3
 */
export const oidMd5Fee: DERItem = new DERItem(
	new Uint8Ptr(new Uint8Array(_oidMd5Fee).buffer),
	_oidMd5Fee.length,
);

/**
 * OID: 1.2.840.113635.100.2.4
 */
export const oidSha1Fee: DERItem = new DERItem(
	new Uint8Ptr(new Uint8Array(_oidSha1Fee).buffer),
	_oidSha1Fee.length,
);

/**
 * OID: 1.2.840.10045.3.1.1
 */
export const oidEcPrime192v1: DERItem = new DERItem(
	new Uint8Ptr(new Uint8Array(_oidEcPrime192v1).buffer),
	_oidEcPrime192v1.length,
);

/**
 * OID: 1.2.840.10045.3.1.7
 */
export const oidEcPrime256v1: DERItem = new DERItem(
	new Uint8Ptr(new Uint8Array(_oidEcPrime256v1).buffer),
	_oidEcPrime256v1.length,
);

/**
 * OID: 1.3.132.0.34
 */
export const oidAnsip384r1: DERItem = new DERItem(
	new Uint8Ptr(new Uint8Array(_oidAnsip384r1).buffer),
	_oidAnsip384r1.length,
);

/**
 * OID: 1.3.132.0.35
 */
export const oidAnsip521r1: DERItem = new DERItem(
	new Uint8Ptr(new Uint8Array(_oidAnsip521r1).buffer),
	_oidAnsip521r1.length,
);

// Extension OIDs:

const _oidSubjectKeyIdentifier = [...OID_EXTENSION, 14] as const;
const _oidKeyUsage = [...OID_EXTENSION, 15] as const;
const _oidPrivateKeyUsagePeriod = [...OID_EXTENSION, 16] as const;
const _oidSubjectAltName = [...OID_EXTENSION, 17] as const;
const _oidIssuerAltName = [...OID_EXTENSION, 18] as const;
const _oidBasicConstraints = [...OID_EXTENSION, 19] as const;
const _oidNameConstraints = [...OID_EXTENSION, 30] as const;
const _oidCrlDistributionPoints = [...OID_EXTENSION, 31] as const;
const _oidCertificatePolicies = [...OID_EXTENSION, 32] as const;
const _oidAnyPolicy = [...OID_EXTENSION, 32, 0] as const;
const _oidPolicyMappings = [...OID_EXTENSION, 33] as const;
const _oidAuthorityKeyIdentifier = [...OID_EXTENSION, 35] as const;
const _oidPolicyConstraints = [...OID_EXTENSION, 36] as const;
const _oidExtendedKeyUsage = [...OID_EXTENSION, 37] as const;
const _oidAnyExtendedKeyUsage = [...OID_EXTENSION, 37, 0] as const;
const _oidInhibitAnyPolicy = [...OID_EXTENSION, 54] as const;
const _oidAuthorityInfoAccess = [...OID_PE, 1] as const;
const _oidSubjectInfoAccess = [...OID_PE, 11] as const;
const _oidAdOCSP = OID_AD_OCSP;
const _oidAdCAIssuer = OID_AD_CAISSUERS;
const _oidNetscapeCertType = [...NETSCAPE_CERT_EXTEN, 1] as const;
const _oidEntrustVersInfo = [...ENTRUST_CERT_EXTEN, 0] as const;
const _oidMSNTPrincipalName = [...MICROSOFT_ENROLLMENT_OID, 2, 3] as const;
const _oidQtCps = [...OID_QT, 1] as const;
const _oidQtUNotice = [...OID_QT, 2] as const;
const _oidCommonName = [...OID_ATTR_TYPE, 3] as const;
const _oidCountryName = [...OID_ATTR_TYPE, 6] as const;
const _oidLocalityName = [...OID_ATTR_TYPE, 7] as const;
const _oidStateOrProvinceName = [...OID_ATTR_TYPE, 8] as const;
const _oidOrganizationName = [...OID_ATTR_TYPE, 10] as const;
const _oidOrganizationalUnitName = [...OID_ATTR_TYPE, 11] as const;
const _oidDescription = [...OID_ATTR_TYPE, 13] as const;
const _oidEmailAddress = [...OID_PKCS_9, 1] as const;
const _oidFriendlyName = [...OID_PKCS_9, 20] as const;
const _oidLocalKeyId = [...OID_PKCS_9, 21] as const;
const _oidExtendedKeyUsageServerAuth = [...OID_KP, 1] as const;
const _oidExtendedKeyUsageClientAuth = [...OID_KP, 2] as const;
const _oidExtendedKeyUsageCodeSigning = [...OID_KP, 3] as const;
const _oidExtendedKeyUsageEmailProtection = [...OID_KP, 4] as const;
const _oidExtendedKeyUsageTimeStamping = [...OID_KP, 8] as const;
const _oidExtendedKeyUsageOCSPSigning = [...OID_KP, 9] as const;
const _oidExtendedKeyUsageIPSec = [...OID_ISAKMP, 2, 2] as const;
const _oidExtendedKeyUsageMicrosoftSGC = [
	...MICROSOFT_BASE_OID,
	10,
	3,
	3,
] as const;
const _oidExtendedKeyUsageNetscapeSGC = [...NETSCAPE_CERT_POLICY, 1] as const;
const _oidAppleSecureBootCertSpec = APPLE_SBOOT_CERT_EXTEN_SBOOT_SPEC_OID;
const _oidAppleSecureBootTicketCertSpec =
	APPLE_SBOOT_CERT_EXTEN_SBOOT_TICKET_SPEC_OID;
const _oidAppleImg4ManifestCertSpec =
	APPLE_SBOOT_CERT_EXTEN_IMG4_MANIFEST_SPEC_OID;
const _oidAppleProvisioningProfile = APPLE_PROVISIONING_PROFILE_OID;
const _oidAppleApplicationSigning = APPLE_APP_SIGNING_OID;
const _oidAppleInstallerPackagingSigningExternal =
	APPLE_INSTALLER_PACKAGE_SIGNING_EXTERNAL_OID;
const _oidAppleTVOSApplicationSigningProd = APPLE_TVOS_APP_SIGNING_PROD_OID;
const _oidAppleTVOSApplicationSigningProdQA = APPLE_TVOS_APP_SIGNING_PRODQA_OID;
const _oidAppleExtendedKeyUsageCodeSigning = APPLE_EKU_CODE_SIGNING;
const _oidAppleExtendedKeyUsageCodeSigningDev = [
	...APPLE_EKU_CODE_SIGNING,
	1,
] as const;
const _oidAppleExtendedKeyUsageAppleID = APPLE_EKU_APPLE_ID;
const _oidAppleExtendedKeyUsagePassbook = APPLE_EKU_PASSBOOK;
const _oidAppleExtendedKeyUsageProfileSigning = APPLE_EKU_PROFILE_SIGNING;
const _oidAppleExtendedKeyUsageQAProfileSigning = APPLE_EKU_QA_PROFILE_SIGNING;
const _oidAppleIntmMarkerAppleWWDR = APPLE_CERT_EXT_INTERMEDIATE_MARKER_WWDR;
const _oidAppleIntmMarkerAppleID = APPLE_CERT_EXT_INTERMEDIATE_MARKER_APPLEID;
const _oidAppleIntmMarkerAppleID2 =
	APPLE_CERT_EXT_INTERMEDIATE_MARKER_APPLEID_2;
const _oidApplePushServiceClient = [
	...APPLE_CERT_EXT_APPLE_PUSH_MARKER,
	2,
] as const;
const _oidApplePolicyMobileStore = APPLE_CERT_POLICY_MOBILE_STORE;
const _oidApplePolicyMobileStoreProdQA = APPLE_CERT_POLICY_MOBILE_STORE_PRODQA;
const _oidApplePolicyEscrowService = APPLE_ESCROW_POLICY_OID;
const _oidAppleCertExtensionAppleIDRecordValidationSigning =
	APPLE_CERT_EXT_APPLE_ID_VALIDATION_RECORD_SIGNING;
const _oidAppleCertExtOSXProvisioningProfileSigning =
	APPLE_CERT_EXT_OSX_PROVISIONING_PROFILE_SIGNING;
const _oidAppleIntmMarkerAppleSystemIntg2 =
	APPLE_CERT_EXT_INTERMEDIATE_MARKER_APPLEID_SYSTEM_INTEGRATION_2;
const _oidAppleIntmMarkerAppleSystemIntgG3 =
	APPLE_CERT_EXT_INTERMEDIATE_MARKER_APPLEID_SYSTEM_INTEGRATION_G3;
const _oidAppleCertExtAppleSMPEncryption = APPLE_CERT_EXT_APPLE_SMP_ENCRYPTION;
const _oidAppleCertExtAppleServerAuthentication =
	APPLE_CERT_EXT_APPLE_SERVER_AUTHENTICATION;
const _oidAppleCertExtAppleServerAuthenticationPPQProdQA =
	APPLE_CERT_EXT_APPLE_SERVER_AUTHENTICATION_PPQ_PRODQA;
const _oidAppleCertExtAppleServerAuthenticationPPQProd =
	APPLE_CERT_EXT_APPLE_SERVER_AUTHENTICATION_PPQ_PROD;
const _oidAppleCertExtAppleServerAuthenticationIDSProdQA =
	APPLE_CERT_EXT_APPLE_SERVER_AUTHENTICATION_IDS_PRODQA;
const _oidAppleCertExtAppleServerAuthenticationIDSProd =
	APPLE_CERT_EXT_APPLE_SERVER_AUTHENTICATION_IDS_PROD;
const _oidAppleCertExtAppleServerAuthenticationAPNProdQA =
	APPLE_CERT_EXT_APPLE_SERVER_AUTHENTICATION_APN_PRODQA;
const _oidAppleCertExtAppleServerAuthenticationAPNProd =
	APPLE_CERT_EXT_APPLE_SERVER_AUTHENTICATION_APN_PROD;
const _oidAppleCertExtAppleServerAuthenticationGS =
	APPLE_CERT_EXT_APPLE_SERVER_AUTHENTICATION_GS;
const _oidAppleIntmMarkerAppleServerAuthentication =
	APPLE_CERT_EXT_INTERMEDIATE_MARKER_APPLE_SERVER_AUTHENTICATION;
const _oidAppleCertExtApplePPQSigningProdQA =
	APPLE_CERT_EXT_APPLE_PPQ_SIGNING_PRODQA;
const _oidAppleCertExtApplePPQSigningProd =
	APPLE_CERT_EXT_APPLE_PPQ_SIGNING_PROD;
const _oidGoogleEmbeddedSignedCertificateTimestamp = GOOGLE_EMBEDDED_SCT_OID;
const _oidGoogleOCSPSignedCertificateTimestamp = GOOGLE_OCSP_SCT_OID;
const _oidAppleCertExtATVAppSigningProdQA = APPLE_ATV_APP_SIGNING_OID_PRODQA;
const _oidAppleCertExtATVAppSigningProd = APPLE_ATV_APP_SIGNING_OID;
const _oidAppleCertExtATVVPNProfileSigning =
	APPLE_CERT_EXT_APPLE_ATV_VPN_PROFILE_SIGNING;
const _oidAppleCertExtCryptoServicesExtEncryption =
	APPLE_CERT_EXT_CRYPTO_SERVICES_EXT_ENCRYPTION;
const _oidAppleCertExtAST2DiagnosticsServerAuthProdQA =
	APPLE_CERT_EXT_AST2_DIAGNOSTICS_SERVER_AUTH_PRODQA;
const _oidAppleCertExtAST2DiagnosticsServerAuthProd =
	APPLE_CERT_EXT_AST2_DIAGNOSTICS_SERVER_AUTH_PROD;
const _oidAppleCertExtEscrowProxyServerAuthProdQA =
	APPLE_CERT_EXT_ESCROW_PROXY_SERVER_AUTH_PRODQA;
const _oidAppleCertExtEscrowProxyServerAuthProd =
	APPLE_CERT_EXT_ESCROW_PROXY_SERVER_AUTH_PROD;
const _oidAppleCertExtFMiPServerAuthProdQA =
	APPLE_CERT_EXT_FMIP_SERVER_AUTH_PRODQA;
const _oidAppleCertExtFMiPServerAuthProd = APPLE_CERT_EXT_FMIP_SERVER_AUTH_PROD;
const _oidAppleCertExtHomeKitServerAuth = APPLE_CERT_EXT_HOME_KIT_SERVER_AUTH;
const _oidAppleIntmMarkerAppleHomeKitServerCA =
	APPLE_CERT_EXT_INTERMEDIATE_MARKER_APPLE_HOME_KIT_SERVER_AUTH;
const _oidAppleCertExtMMCSServerAuthProdQA =
	APPLE_CERT_EXT_MMCS_SERVER_AUTH_PRODQA;
const _oidAppleCertExtMMCSServerAuthProd = APPLE_CERT_EXT_MMCS_SERVER_AUTH_PROD;
const _oidAppleCertExtiCloudSetupServerAuthProdQA =
	APPLE_CERT_EXT_ICLOUD_SETUP_SERVER_AUTH_PRODQA;
const _oidAppleCertExtiCloudSetupServerAuthProd =
	APPLE_CERT_EXT_ICLOUD_SETUP_SERVER_AUTH_PROD;

/**
 * OID: 2.5.29.14
 */
export const oidSubjectKeyIdentifier: DERItem = new DERItem(
	new Uint8Ptr(new Uint8Array(_oidSubjectKeyIdentifier).buffer),
	_oidSubjectKeyIdentifier.length,
);

/**
 * OID: 2.5.29.15
 */
export const oidKeyUsage: DERItem = new DERItem(
	new Uint8Ptr(new Uint8Array(_oidKeyUsage).buffer),
	_oidKeyUsage.length,
);

/**
 * OID: 2.5.29.16
 */
export const oidPrivateKeyUsagePeriod: DERItem = new DERItem(
	new Uint8Ptr(new Uint8Array(_oidPrivateKeyUsagePeriod).buffer),
	_oidPrivateKeyUsagePeriod.length,
);

/**
 * OID: 2.5.29.17
 */
export const oidSubjectAltName: DERItem = new DERItem(
	new Uint8Ptr(new Uint8Array(_oidSubjectAltName).buffer),
	_oidSubjectAltName.length,
);

/**
 * OID: 2.5.29.18
 */
export const oidIssuerAltName: DERItem = new DERItem(
	new Uint8Ptr(new Uint8Array(_oidIssuerAltName).buffer),
	_oidIssuerAltName.length,
);

/**
 * OID: 2.5.29.19
 */
export const oidBasicConstraints: DERItem = new DERItem(
	new Uint8Ptr(new Uint8Array(_oidBasicConstraints).buffer),
	_oidBasicConstraints.length,
);

/**
 * OID: 2.5.29.30
 */
export const oidNameConstraints: DERItem = new DERItem(
	new Uint8Ptr(new Uint8Array(_oidNameConstraints).buffer),
	_oidNameConstraints.length,
);

/**
 * OID: 2.5.29.31
 */
export const oidCrlDistributionPoints: DERItem = new DERItem(
	new Uint8Ptr(new Uint8Array(_oidCrlDistributionPoints).buffer),
	_oidCrlDistributionPoints.length,
);

/**
 * OID: 2.5.29.32
 */
export const oidCertificatePolicies: DERItem = new DERItem(
	new Uint8Ptr(new Uint8Array(_oidCertificatePolicies).buffer),
	_oidCertificatePolicies.length,
);

/**
 * OID: 2.5.29.32.0
 */
export const oidAnyPolicy: DERItem = new DERItem(
	new Uint8Ptr(new Uint8Array(_oidAnyPolicy).buffer),
	_oidAnyPolicy.length,
);

/**
 * OID: 2.5.29.33
 */
export const oidPolicyMappings: DERItem = new DERItem(
	new Uint8Ptr(new Uint8Array(_oidPolicyMappings).buffer),
	_oidPolicyMappings.length,
);

/**
 * OID: 2.5.29.35
 */
export const oidAuthorityKeyIdentifier: DERItem = new DERItem(
	new Uint8Ptr(new Uint8Array(_oidAuthorityKeyIdentifier).buffer),
	_oidAuthorityKeyIdentifier.length,
);

/**
 * OID: 2.5.29.36
 */
export const oidPolicyConstraints: DERItem = new DERItem(
	new Uint8Ptr(new Uint8Array(_oidPolicyConstraints).buffer),
	_oidPolicyConstraints.length,
);

/**
 * OID: 2.5.29.37
 */
export const oidExtendedKeyUsage: DERItem = new DERItem(
	new Uint8Ptr(new Uint8Array(_oidExtendedKeyUsage).buffer),
	_oidExtendedKeyUsage.length,
);

/**
 * OID: 2.5.29.37.0
 */
export const oidAnyExtendedKeyUsage: DERItem = new DERItem(
	new Uint8Ptr(new Uint8Array(_oidAnyExtendedKeyUsage).buffer),
	_oidAnyExtendedKeyUsage.length,
);

/**
 * OID: 2.5.29.54
 */
export const oidInhibitAnyPolicy: DERItem = new DERItem(
	new Uint8Ptr(new Uint8Array(_oidInhibitAnyPolicy).buffer),
	_oidInhibitAnyPolicy.length,
);

/**
 * OID: 1.3.6.1.5.5.7.1.1
 */
export const oidAuthorityInfoAccess: DERItem = new DERItem(
	new Uint8Ptr(new Uint8Array(_oidAuthorityInfoAccess).buffer),
	_oidAuthorityInfoAccess.length,
);

/**
 * OID: 1.3.6.1.5.5.7.1.11
 */
export const oidSubjectInfoAccess: DERItem = new DERItem(
	new Uint8Ptr(new Uint8Array(_oidSubjectInfoAccess).buffer),
	_oidSubjectInfoAccess.length,
);

/**
 * OID: 1.3.6.1.5.5.7.48.1
 */
export const oidAdOCSP: DERItem = new DERItem(
	new Uint8Ptr(new Uint8Array(_oidAdOCSP).buffer),
	_oidAdOCSP.length,
);

/**
 * OID: 1.3.6.1.5.5.7.48.2
 */
export const oidAdCAIssuer: DERItem = new DERItem(
	new Uint8Ptr(new Uint8Array(_oidAdCAIssuer).buffer),
	_oidAdCAIssuer.length,
);

/**
 * OID: 2.16.840.1.113730.1.1
 */
export const oidNetscapeCertType: DERItem = new DERItem(
	new Uint8Ptr(new Uint8Array(_oidNetscapeCertType).buffer),
	_oidNetscapeCertType.length,
);

/**
 * OID: 1.2.840.113533.7.65.0
 */
export const oidEntrustVersInfo: DERItem = new DERItem(
	new Uint8Ptr(new Uint8Array(_oidEntrustVersInfo).buffer),
	_oidEntrustVersInfo.length,
);

/**
 * OID: 1.3.6.1.4.1.311.20.2.3
 */
export const oidMSNTPrincipalName: DERItem = new DERItem(
	new Uint8Ptr(new Uint8Array(_oidMSNTPrincipalName).buffer),
	_oidMSNTPrincipalName.length,
);

/**
 * OID: 1.3.6.1.5.5.7.2.1
 */
export const oidQtCps: DERItem = new DERItem(
	new Uint8Ptr(new Uint8Array(_oidQtCps).buffer),
	_oidQtCps.length,
);

/**
 * OID: 1.3.6.1.5.5.7.2.2
 */
export const oidQtUNotice: DERItem = new DERItem(
	new Uint8Ptr(new Uint8Array(_oidQtUNotice).buffer),
	_oidQtUNotice.length,
);

/**
 * OID: 2.5.4.3
 */
export const oidCommonName: DERItem = new DERItem(
	new Uint8Ptr(new Uint8Array(_oidCommonName).buffer),
	_oidCommonName.length,
);

/**
 * OID: 2.5.4.6
 */
export const oidCountryName: DERItem = new DERItem(
	new Uint8Ptr(new Uint8Array(_oidCountryName).buffer),
	_oidCountryName.length,
);

/**
 * OID: 2.5.4.7
 */
export const oidLocalityName: DERItem = new DERItem(
	new Uint8Ptr(new Uint8Array(_oidLocalityName).buffer),
	_oidLocalityName.length,
);

/**
 * OID: 2.5.4.8
 */
export const oidStateOrProvinceName: DERItem = new DERItem(
	new Uint8Ptr(new Uint8Array(_oidStateOrProvinceName).buffer),
	_oidStateOrProvinceName.length,
);

/**
 * OID: 2.5.4.10
 */
export const oidOrganizationName: DERItem = new DERItem(
	new Uint8Ptr(new Uint8Array(_oidOrganizationName).buffer),
	_oidOrganizationName.length,
);

/**
 * OID: 2.5.4.11
 */
export const oidOrganizationalUnitName: DERItem = new DERItem(
	new Uint8Ptr(new Uint8Array(_oidOrganizationalUnitName).buffer),
	_oidOrganizationalUnitName.length,
);

/**
 * OID: 2.5.4.13
 */
export const oidDescription: DERItem = new DERItem(
	new Uint8Ptr(new Uint8Array(_oidDescription).buffer),
	_oidDescription.length,
);

/**
 * OID: 1.2.840.113549.1.9.1
 */
export const oidEmailAddress: DERItem = new DERItem(
	new Uint8Ptr(new Uint8Array(_oidEmailAddress).buffer),
	_oidEmailAddress.length,
);

/**
 * OID: 1.2.840.113549.1.9.20
 */
export const oidFriendlyName: DERItem = new DERItem(
	new Uint8Ptr(new Uint8Array(_oidFriendlyName).buffer),
	_oidFriendlyName.length,
);

/**
 * OID: 1.2.840.113549.1.9.21
 */
export const oidLocalKeyId: DERItem = new DERItem(
	new Uint8Ptr(new Uint8Array(_oidLocalKeyId).buffer),
	_oidLocalKeyId.length,
);

/**
 * OID: 1.3.6.1.5.5.7.3.1
 */
export const oidExtendedKeyUsageServerAuth: DERItem = new DERItem(
	new Uint8Ptr(new Uint8Array(_oidExtendedKeyUsageServerAuth).buffer),
	_oidExtendedKeyUsageServerAuth.length,
);

/**
 * OID: 1.3.6.1.5.5.7.3.2
 */
export const oidExtendedKeyUsageClientAuth: DERItem = new DERItem(
	new Uint8Ptr(new Uint8Array(_oidExtendedKeyUsageClientAuth).buffer),
	_oidExtendedKeyUsageClientAuth.length,
);

/**
 * OID: 1.3.6.1.5.5.7.3.3
 */
export const oidExtendedKeyUsageCodeSigning: DERItem = new DERItem(
	new Uint8Ptr(new Uint8Array(_oidExtendedKeyUsageCodeSigning).buffer),
	_oidExtendedKeyUsageCodeSigning.length,
);

/**
 * OID: 1.3.6.1.5.5.7.3.4
 */
export const oidExtendedKeyUsageEmailProtection: DERItem = new DERItem(
	new Uint8Ptr(new Uint8Array(_oidExtendedKeyUsageEmailProtection).buffer),
	_oidExtendedKeyUsageEmailProtection.length,
);

/**
 * OID: 1.3.6.1.5.5.7.3.8
 */
export const oidExtendedKeyUsageTimeStamping: DERItem = new DERItem(
	new Uint8Ptr(new Uint8Array(_oidExtendedKeyUsageTimeStamping).buffer),
	_oidExtendedKeyUsageTimeStamping.length,
);

/**
 * OID: 1.3.6.1.5.5.7.3.9
 */
export const oidExtendedKeyUsageOCSPSigning: DERItem = new DERItem(
	new Uint8Ptr(new Uint8Array(_oidExtendedKeyUsageOCSPSigning).buffer),
	_oidExtendedKeyUsageOCSPSigning.length,
);

/**
 * OID: 1.3.6.1.5.5.8.2.2
 */
export const oidExtendedKeyUsageIPSec: DERItem = new DERItem(
	new Uint8Ptr(new Uint8Array(_oidExtendedKeyUsageIPSec).buffer),
	_oidExtendedKeyUsageIPSec.length,
);

/**
 * OID: 1.3.6.1.4.1.311.10.3.3
 */
export const oidExtendedKeyUsageMicrosoftSGC: DERItem = new DERItem(
	new Uint8Ptr(new Uint8Array(_oidExtendedKeyUsageMicrosoftSGC).buffer),
	_oidExtendedKeyUsageMicrosoftSGC.length,
);

/**
 * OID: 2.16.840.1.113730.4.1
 */
export const oidExtendedKeyUsageNetscapeSGC: DERItem = new DERItem(
	new Uint8Ptr(new Uint8Array(_oidExtendedKeyUsageNetscapeSGC).buffer),
	_oidExtendedKeyUsageNetscapeSGC.length,
);

/**
 * OID: 1.2.840.113635.100.6.1.1
 */
export const oidAppleSecureBootCertSpec: DERItem = new DERItem(
	new Uint8Ptr(new Uint8Array(_oidAppleSecureBootCertSpec).buffer),
	_oidAppleSecureBootCertSpec.length,
);

/**
 * OID: 1.2.840.113635.100.6.1.11
 */
export const oidAppleSecureBootTicketCertSpec: DERItem = new DERItem(
	new Uint8Ptr(new Uint8Array(_oidAppleSecureBootTicketCertSpec).buffer),
	_oidAppleSecureBootTicketCertSpec.length,
);

/**
 * OID: 1.2.840.113635.100.6.1.15
 */
export const oidAppleImg4ManifestCertSpec: DERItem = new DERItem(
	new Uint8Ptr(new Uint8Array(_oidAppleImg4ManifestCertSpec).buffer),
	_oidAppleImg4ManifestCertSpec.length,
);

/**
 * OID: 1.2.840.113635.100.6.2.1
 */
export const oidAppleProvisioningProfile: DERItem = new DERItem(
	new Uint8Ptr(new Uint8Array(_oidAppleProvisioningProfile).buffer),
	_oidAppleProvisioningProfile.length,
);

/**
 * OID: 1.2.840.113635.100.6.1.3
 */
export const oidAppleApplicationSigning: DERItem = new DERItem(
	new Uint8Ptr(new Uint8Array(_oidAppleApplicationSigning).buffer),
	_oidAppleApplicationSigning.length,
);

/**
 * OID: 1.2.840.113635.100.6.1.16
 */
export const oidAppleInstallerPackagingSigningExternal: DERItem = new DERItem(
	new Uint8Ptr(
		new Uint8Array(_oidAppleInstallerPackagingSigningExternal).buffer,
	),
	_oidAppleInstallerPackagingSigningExternal.length,
);

/**
 * OID: 1.2.840.113635.100.6.1.24
 */
export const oidAppleTVOSApplicationSigningProd: DERItem = new DERItem(
	new Uint8Ptr(new Uint8Array(_oidAppleTVOSApplicationSigningProd).buffer),
	_oidAppleTVOSApplicationSigningProd.length,
);

/**
 * OID: 1.2.840.113635.100.6.1.24.1
 */
export const oidAppleTVOSApplicationSigningProdQA: DERItem = new DERItem(
	new Uint8Ptr(new Uint8Array(_oidAppleTVOSApplicationSigningProdQA).buffer),
	_oidAppleTVOSApplicationSigningProdQA.length,
);

/**
 * OID: 1.2.840.113635.100.4.1
 */
export const oidAppleExtendedKeyUsageCodeSigning: DERItem = new DERItem(
	new Uint8Ptr(new Uint8Array(_oidAppleExtendedKeyUsageCodeSigning).buffer),
	_oidAppleExtendedKeyUsageCodeSigning.length,
);

/**
 * OID: 1.2.840.113635.100.4.1.1
 */
export const oidAppleExtendedKeyUsageCodeSigningDev: DERItem = new DERItem(
	new Uint8Ptr(
		new Uint8Array(_oidAppleExtendedKeyUsageCodeSigningDev).buffer,
	),
	_oidAppleExtendedKeyUsageCodeSigningDev.length,
);

/**
 * OID: 1.2.840.113635.100.4.7
 */
export const oidAppleExtendedKeyUsageAppleID: DERItem = new DERItem(
	new Uint8Ptr(new Uint8Array(_oidAppleExtendedKeyUsageAppleID).buffer),
	_oidAppleExtendedKeyUsageAppleID.length,
);

/**
 * OID: 1.2.840.113635.100.4.14
 */
export const oidAppleExtendedKeyUsagePassbook: DERItem = new DERItem(
	new Uint8Ptr(new Uint8Array(_oidAppleExtendedKeyUsagePassbook).buffer),
	_oidAppleExtendedKeyUsagePassbook.length,
);

/**
 * OID: 1.2.840.113635.100.4.16
 */
export const oidAppleExtendedKeyUsageProfileSigning: DERItem = new DERItem(
	new Uint8Ptr(
		new Uint8Array(_oidAppleExtendedKeyUsageProfileSigning).buffer,
	),
	_oidAppleExtendedKeyUsageProfileSigning.length,
);

/**
 * OID: 1.2.840.113635.100.4.17
 */
export const oidAppleExtendedKeyUsageQAProfileSigning: DERItem = new DERItem(
	new Uint8Ptr(
		new Uint8Array(_oidAppleExtendedKeyUsageQAProfileSigning).buffer,
	),
	_oidAppleExtendedKeyUsageQAProfileSigning.length,
);

/**
 * OID: 1.2.840.113635.100.6.2.1
 */
export const oidAppleIntmMarkerAppleWWDR: DERItem = new DERItem(
	new Uint8Ptr(new Uint8Array(_oidAppleIntmMarkerAppleWWDR).buffer),
	_oidAppleIntmMarkerAppleWWDR.length,
);

/**
 * OID: 1.2.840.113635.100.6.2.3
 */
export const oidAppleIntmMarkerAppleID: DERItem = new DERItem(
	new Uint8Ptr(new Uint8Array(_oidAppleIntmMarkerAppleID).buffer),
	_oidAppleIntmMarkerAppleID.length,
);

/**
 * OID: 1.2.840.113635.100.6.2.7
 */
export const oidAppleIntmMarkerAppleID2: DERItem = new DERItem(
	new Uint8Ptr(new Uint8Array(_oidAppleIntmMarkerAppleID2).buffer),
	_oidAppleIntmMarkerAppleID2.length,
);

/**
 * OID: 1.2.840.113635.100.6.2.7
 */
export const oidApplePushServiceClient: DERItem = new DERItem(
	new Uint8Ptr(new Uint8Array(_oidAppleIntmMarkerAppleID2).buffer),
	_oidAppleIntmMarkerAppleID2.length,
);

/**
 * OID: 1.2.840.113635.100.5.12
 */
export const oidApplePolicyMobileStore: DERItem = new DERItem(
	new Uint8Ptr(new Uint8Array(_oidApplePolicyMobileStore).buffer),
	_oidApplePolicyMobileStore.length,
);

/**
 * OID: 1.2.840.113635.100.5.12.1
 */
export const oidApplePolicyMobileStoreProdQA: DERItem = new DERItem(
	new Uint8Ptr(new Uint8Array(_oidApplePolicyMobileStoreProdQA).buffer),
	_oidApplePolicyMobileStoreProdQA.length,
);

/**
 * OID: 1.2.840.113635.100.6.23.1
 */
export const oidApplePolicyEscrowService: DERItem = new DERItem(
	new Uint8Ptr(new Uint8Array(_oidApplePolicyEscrowService).buffer),
	_oidApplePolicyEscrowService.length,
);

/**
 * OID: 1.2.840.113635.100.6.25
 */
export const oidAppleCertExtensionAppleIDRecordValidationSigning: DERItem =
	new DERItem(
		new Uint8Ptr(
			new Uint8Array(_oidAppleCertExtensionAppleIDRecordValidationSigning)
				.buffer,
		),
		_oidAppleCertExtensionAppleIDRecordValidationSigning.length,
	);

/**
 * OID: 1.2.840.113635.100.4.11
 */
export const oidAppleCertExtOSXProvisioningProfileSigning: DERItem =
	new DERItem(
		new Uint8Ptr(
			new Uint8Array(_oidAppleCertExtOSXProvisioningProfileSigning)
				.buffer,
		),
		_oidAppleCertExtOSXProvisioningProfileSigning.length,
	);

/**
 * OID: 1.2.840.113635.100.6.2.10
 */
export const oidAppleIntmMarkerAppleSystemIntg2: DERItem = new DERItem(
	new Uint8Ptr(new Uint8Array(_oidAppleIntmMarkerAppleSystemIntg2).buffer),
	_oidAppleIntmMarkerAppleSystemIntg2.length,
);

/**
 * OID: 1.2.840.113635.100.6.2.13
 */
export const oidAppleIntmMarkerAppleSystemIntgG3: DERItem = new DERItem(
	new Uint8Ptr(new Uint8Array(_oidAppleIntmMarkerAppleSystemIntgG3).buffer),
	_oidAppleIntmMarkerAppleSystemIntgG3.length,
);

/**
 * OID: 1.2.840.113635.100.6.30
 */
export const oidAppleCertExtAppleSMPEncryption: DERItem = new DERItem(
	new Uint8Ptr(new Uint8Array(_oidAppleCertExtAppleSMPEncryption).buffer),
	_oidAppleCertExtAppleSMPEncryption.length,
);

/**
 * OID: 1.2.840.113635.100.6.27.1
 */
export const oidAppleCertExtAppleServerAuthentication: DERItem = new DERItem(
	new Uint8Ptr(
		new Uint8Array(_oidAppleCertExtAppleServerAuthentication).buffer,
	),
	_oidAppleCertExtAppleServerAuthentication.length,
);

/**
 * OID: 1.2.840.113635.100.6.27.4.1
 */
export const oidAppleCertExtAppleServerAuthenticationIDSProdQA: DERItem =
	new DERItem(
		new Uint8Ptr(
			new Uint8Array(_oidAppleCertExtAppleServerAuthenticationIDSProdQA)
				.buffer,
		),
		_oidAppleCertExtAppleServerAuthenticationIDSProdQA.length,
	);

/**
 * OID: 1.2.840.113635.100.6.27.4.2
 */
export const oidAppleCertExtAppleServerAuthenticationIDSProd: DERItem =
	new DERItem(
		new Uint8Ptr(
			new Uint8Array(_oidAppleCertExtAppleServerAuthenticationIDSProd)
				.buffer,
		),
		_oidAppleCertExtAppleServerAuthenticationIDSProd.length,
	);

/**
 * OID: 1.2.840.113635.100.6.27.5.1
 */
export const oidAppleCertExtAppleServerAuthenticationAPNProdQA: DERItem =
	new DERItem(
		new Uint8Ptr(
			new Uint8Array(_oidAppleCertExtAppleServerAuthenticationAPNProdQA)
				.buffer,
		),
		_oidAppleCertExtAppleServerAuthenticationAPNProdQA.length,
	);

/**
 * OID: 1.2.840.113635.100.6.27.5.2
 */
export const oidAppleCertExtAppleServerAuthenticationAPNProd: DERItem =
	new DERItem(
		new Uint8Ptr(
			new Uint8Array(_oidAppleCertExtAppleServerAuthenticationAPNProd)
				.buffer,
		),
		_oidAppleCertExtAppleServerAuthenticationAPNProd.length,
	);

/**
 * OID: 1.2.840.113635.100.6.27.2
 */
export const oidAppleCertExtAppleServerAuthenticationGS: DERItem = new DERItem(
	new Uint8Ptr(
		new Uint8Array(_oidAppleCertExtAppleServerAuthenticationGS).buffer,
	),
	_oidAppleCertExtAppleServerAuthenticationGS.length,
);

/**
 * OID: 1.2.840.113635.100.6.27.3.1
 */
export const oidAppleCertExtAppleServerAuthenticationPPQProdQA: DERItem =
	new DERItem(
		new Uint8Ptr(
			new Uint8Array(_oidAppleCertExtAppleServerAuthenticationPPQProdQA)
				.buffer,
		),
		_oidAppleCertExtAppleServerAuthenticationPPQProdQA.length,
	);

/**
 * OID: 1.2.840.113635.100.6.27.3.2
 */
export const oidAppleCertExtAppleServerAuthenticationPPQProd: DERItem =
	new DERItem(
		new Uint8Ptr(
			new Uint8Array(_oidAppleCertExtAppleServerAuthenticationPPQProd)
				.buffer,
		),
		_oidAppleCertExtAppleServerAuthenticationPPQProd.length,
	);

/**
 * OID: 1.2.840.113635.100.6.2.12
 */
export const oidAppleIntmMarkerAppleServerAuthentication: DERItem = new DERItem(
	new Uint8Ptr(
		new Uint8Array(_oidAppleIntmMarkerAppleServerAuthentication).buffer,
	),
	_oidAppleIntmMarkerAppleServerAuthentication.length,
);

/**
 * OID: 1.2.840.113635.100.6.38.2
 */
export const oidAppleCertExtApplePPQSigningProd: DERItem = new DERItem(
	new Uint8Ptr(new Uint8Array(_oidAppleCertExtApplePPQSigningProd).buffer),
	_oidAppleCertExtApplePPQSigningProd.length,
);

/**
 * OID: 1.2.840.113635.100.6.38.1
 */
export const oidAppleCertExtApplePPQSigningProdQA: DERItem = new DERItem(
	new Uint8Ptr(new Uint8Array(_oidAppleCertExtApplePPQSigningProdQA).buffer),
	_oidAppleCertExtApplePPQSigningProdQA.length,
);

/**
 * OID: 1.3.6.1.4.1.11129.2.4.2
 */
export const oidGoogleEmbeddedSignedCertificateTimestamp: DERItem = new DERItem(
	new Uint8Ptr(
		new Uint8Array(_oidGoogleEmbeddedSignedCertificateTimestamp).buffer,
	),
	_oidGoogleEmbeddedSignedCertificateTimestamp.length,
);

/**
 * OID: 1.3.6.1.4.1.11129.2.4.5
 */
export const oidGoogleOCSPSignedCertificateTimestamp: DERItem = new DERItem(
	new Uint8Ptr(
		new Uint8Array(_oidGoogleOCSPSignedCertificateTimestamp).buffer,
	),
	_oidGoogleOCSPSignedCertificateTimestamp.length,
);

/**
 * OID: 1.2.840.113635.100.6.1.24
 */
export const oidAppleCertExtATVAppSigningProd: DERItem = new DERItem(
	new Uint8Ptr(new Uint8Array(_oidAppleCertExtATVAppSigningProd).buffer),
	_oidAppleCertExtATVAppSigningProd.length,
);

/**
 * OID: 1.2.840.113635.100.6.1.24.1
 */
export const oidAppleCertExtATVAppSigningProdQA: DERItem = new DERItem(
	new Uint8Ptr(new Uint8Array(_oidAppleCertExtATVAppSigningProdQA).buffer),
	_oidAppleCertExtATVAppSigningProdQA.length,
);

/**
 * OID: 1.2.840.113635.100.6.43
 */
export const oidAppleCertExtATVVPNProfileSigning: DERItem = new DERItem(
	new Uint8Ptr(new Uint8Array(_oidAppleCertExtATVVPNProfileSigning).buffer),
	_oidAppleCertExtATVVPNProfileSigning.length,
);

/**
 * OID: 1.2.840.113635.100.6.39
 */
export const oidAppleCertExtCryptoServicesExtEncryption: DERItem = new DERItem(
	new Uint8Ptr(
		new Uint8Array(_oidAppleCertExtCryptoServicesExtEncryption).buffer,
	),
	_oidAppleCertExtCryptoServicesExtEncryption.length,
);

/**
 * OID: 1.2.840.113635.100.6.27.8.1
 */
export const oidAppleCertExtAST2DiagnosticsServerAuthProdQA: DERItem =
	new DERItem(
		new Uint8Ptr(
			new Uint8Array(_oidAppleCertExtAST2DiagnosticsServerAuthProdQA)
				.buffer,
		),
		_oidAppleCertExtAST2DiagnosticsServerAuthProdQA.length,
	);

/**
 * OID: 1.2.840.113635.100.6.27.8.2
 */
export const oidAppleCertExtAST2DiagnosticsServerAuthProd: DERItem =
	new DERItem(
		new Uint8Ptr(
			new Uint8Array(_oidAppleCertExtAST2DiagnosticsServerAuthProd)
				.buffer,
		),
		_oidAppleCertExtAST2DiagnosticsServerAuthProd.length,
	);

/**
 * OID: 1.2.840.113635.100.6.27.7.1
 */
export const oidAppleCertExtEscrowProxyServerAuthProdQA: DERItem = new DERItem(
	new Uint8Ptr(
		new Uint8Array(_oidAppleCertExtEscrowProxyServerAuthProdQA).buffer,
	),
	_oidAppleCertExtEscrowProxyServerAuthProdQA.length,
);

/**
 * OID: 1.2.840.113635.100.6.27.7.2
 */
export const oidAppleCertExtEscrowProxyServerAuthProd: DERItem = new DERItem(
	new Uint8Ptr(
		new Uint8Array(_oidAppleCertExtEscrowProxyServerAuthProd).buffer,
	),
	_oidAppleCertExtEscrowProxyServerAuthProd.length,
);

/**
 * OID: 1.2.840.113635.100.6.27.6.1
 */
export const oidAppleCertExtFMiPServerAuthProdQA: DERItem = new DERItem(
	new Uint8Ptr(new Uint8Array(_oidAppleCertExtFMiPServerAuthProdQA).buffer),
	_oidAppleCertExtFMiPServerAuthProdQA.length,
);

/**
 * OID: 1.2.840.113635.100.6.27.6.2
 */
export const oidAppleCertExtFMiPServerAuthProd: DERItem = new DERItem(
	new Uint8Ptr(new Uint8Array(_oidAppleCertExtFMiPServerAuthProd).buffer),
	_oidAppleCertExtFMiPServerAuthProd.length,
);

/**
 * OID: 1.2.840.113635.100.6.27.9
 */
export const oidAppleCertExtHomeKitServerAuth: DERItem = new DERItem(
	new Uint8Ptr(new Uint8Array(_oidAppleCertExtHomeKitServerAuth).buffer),
	_oidAppleCertExtHomeKitServerAuth.length,
);

/**
 * OID: 1.2.840.113635.100.6.2.16
 */
export const oidAppleIntmMarkerAppleHomeKitServerCA: DERItem = new DERItem(
	new Uint8Ptr(
		new Uint8Array(_oidAppleIntmMarkerAppleHomeKitServerCA).buffer,
	),
	_oidAppleIntmMarkerAppleHomeKitServerCA.length,
);

/**
 * OID: 1.2.840.113635.100.6.27.11.1
 */
export const oidAppleCertExtAppleServerAuthenticationMMCSProdQA: DERItem =
	new DERItem(
		new Uint8Ptr(
			new Uint8Array(_oidAppleCertExtMMCSServerAuthProdQA).buffer,
		),
		_oidAppleCertExtMMCSServerAuthProdQA.length,
	);

/**
 * OID: 1.2.840.113635.100.6.27.11.2
 */
export const oidAppleCertExtAppleServerAuthenticationMMCSProd: DERItem =
	new DERItem(
		new Uint8Ptr(new Uint8Array(_oidAppleCertExtMMCSServerAuthProd).buffer),
		_oidAppleCertExtMMCSServerAuthProd.length,
	);

/**
 * OID: 1.2.840.113635.100.6.27.15.1
 */
export const oidAppleCertExtAppleServerAuthenticationiCloudSetupProdQA:
	DERItem = new DERItem(
		new Uint8Ptr(
			new Uint8Array(_oidAppleCertExtiCloudSetupServerAuthProdQA).buffer,
		),
		_oidAppleCertExtiCloudSetupServerAuthProdQA.length,
	);

/**
 * OID: 1.2.840.113635.100.6.27.15.2
 */
export const oidAppleCertExtAppleServerAuthenticationiCloudSetupProd: DERItem =
	new DERItem(
		new Uint8Ptr(
			new Uint8Array(_oidAppleCertExtiCloudSetupServerAuthProd).buffer,
		),
		_oidAppleCertExtiCloudSetupServerAuthProd.length,
	);
