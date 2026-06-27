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
