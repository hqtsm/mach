// Intel CSSM:

/**
 * Intel OID: 2.16.840.1.113741
 */
export const INTEL = [96, 134, 72, 1, 134, 248, 77] as const;

/**
 * Length of: INTEL
 */
export const INTEL_LENGTH = INTEL.length;

/**
 * Intel OID: 2.16.840.1.113741.2
 */
export const INTEL_CDSASECURITY = [...INTEL, 2] as const;

/**
 * Length of: INTEL_CDSASECURITY
 */
export const INTEL_CDSASECURITY_LENGTH = INTEL_CDSASECURITY.length;

/**
 * Intel OID: 2.16.840.1.113741.2.1
 */
export const INTEL_SEC_FORMATS = [...INTEL_CDSASECURITY, 1] as const;

/**
 * Length of: INTEL_SEC_FORMATS
 */
export const INTEL_SEC_FORMATS_LENGTH = INTEL_SEC_FORMATS.length;

/**
 * Intel OID: 2.16.840.1.113741.2.2.5
 */
export const INTEL_SEC_ALGS = [...INTEL_CDSASECURITY, 2, 5] as const;

/**
 * Length of: INTEL_SEC_ALGS
 */
export const INTEL_SEC_ALGS_LENGTH = INTEL_SEC_ALGS.length;

/**
 * Intel OID: 2.16.840.1.113741.2.1.4
 */
export const INTEL_SEC_OBJECT_BUNDLE = [...INTEL_SEC_FORMATS, 4] as const;

/**
 * Length of: INTEL_SEC_OBJECT_BUNDLE
 */
export const INTEL_SEC_OBJECT_BUNDLE_LENGTH = INTEL_SEC_OBJECT_BUNDLE.length;

/**
 * Intel OID: 2.16.840.1.113741.2.1.4.1
 */
export const INTEL_CERT_AND_PRIVATE_KEY_2_0 = [
	...INTEL_SEC_OBJECT_BUNDLE,
	1,
] as const;

/**
 * Length of: INTEL_CERT_AND_PRIVATE_KEY_2_0
 */
export const INTEL_CERT_AND_PRIVATE_KEY_2_0_LENGTH =
	INTEL_CERT_AND_PRIVATE_KEY_2_0.length;

/**
 * Intel X.509 C data type
 */
export const INTEL_X509_C_DATATYPE = 1;

/**
 * Intel X.509 LDAP String data type
 */
export const INTEL_X509_LDAPSTRING_DATATYPE = 2;

/**
 * OID: 2.5
 */
export const OID_ISO_CCITT_DIR_SERVICE = [85] as const;

/**
 * OID: 2.5
 */
export const OID_DS = OID_ISO_CCITT_DIR_SERVICE;

/**
 * Length of: OID_DS
 */
export const OID_DS_LENGTH = OID_DS.length;

/**
 * OID: 2.5.4
 */
export const OID_ATTR_TYPE = [...OID_DS, 4] as const;

/**
 * Length of: OID_ATTR_TYPE
 */
export const OID_ATTR_TYPE_LENGTH = OID_ATTR_TYPE.length;

/**
 * OID: 2.5.29
 */
export const OID_EXTENSION = [...OID_DS, 29] as const;

/**
 * Length of: OID_EXTENSION
 */
export const OID_EXTENSION_LENGTH = OID_EXTENSION.length;

/**
 * OID: 1.0
 */
export const OID_ISO_STANDARD = [40] as const;

/**
 * OID: 1.2
 */
export const OID_ISO_MEMBER = [42] as const;

/**
 * OID: 1.2.840
 */
export const OID_US = [...OID_ISO_MEMBER, 134, 72] as const;

/**
 * OID: 1.3
 */
export const OID_ISO_IDENTIFIED_ORG = [43] as const;

/**
 * OID: 1.3.4
 */
export const OID_OSINET = [...OID_ISO_IDENTIFIED_ORG, 4] as const;

/**
 * OID: 1.3.5
 */
export const OID_GOSIP = [...OID_ISO_IDENTIFIED_ORG, 5] as const;

/**
 * OID: 1.3.6
 */
export const OID_DOD = [...OID_ISO_IDENTIFIED_ORG, 6] as const;

/**
 * OID: 1.3.14
 */
export const OID_OIW = [...OID_ISO_IDENTIFIED_ORG, 14] as const;

/**
 * OID: 1.3.9
 */
export const OID_ITU_RFCDATA = [9] as const;

/**
 * Length of: OID_ITU_RFCDATA
 */
export const OID_ITU_RFCDATA_MEMBER_LENGTH = OID_ITU_RFCDATA.length;

// PKCS Standards:

/**
 * Length of: OID_ISO_MEMBER
 */
export const OID_ISO_MEMBER_LENGTH = OID_ISO_MEMBER.length;

/**
 * Length of: OID_US
 */
export const OID_US_LENGTH = OID_US.length;

/**
 * OID: 1.2.840.113549
 */
export const OID_RSA = [...OID_US, 134, 247, 13] as const;

/**
 * Length of: OID_RSA
 */
export const OID_RSA_LENGTH = OID_RSA.length;

/**
 * OID: 1.2.840.113549.2
 */
export const OID_RSA_HASH = [...OID_RSA, 2] as const;

/**
 * Length of: OID_RSA_HASH
 */
export const OID_RSA_HASH_LENGTH = OID_RSA_HASH.length;

/**
 * OID: 1.2.840.113549.3
 */
export const OID_RSA_ENCRYPT = [...OID_RSA, 3] as const;

/**
 * Length of: OID_RSA_ENCRYPT
 */
export const OID_RSA_ENCRYPT_LENGTH = OID_RSA_ENCRYPT.length;

/**
 * OID: 1.2.840.113549.1
 */
export const OID_PKCS = [...OID_RSA, 1] as const;

/**
 * Length of: OID_PKCS
 */
export const OID_PKCS_LENGTH = OID_PKCS.length;

/**
 * OID: 1.2.840.113549.1.1
 */
export const OID_PKCS_1 = [...OID_PKCS, 1] as const;

/**
 * Length of: OID_PKCS_1
 */
export const OID_PKCS_1_LENGTH = OID_PKCS_1.length;

/**
 * OID: 1.2.840.113549.1.2
 */
export const OID_PKCS_2 = [...OID_PKCS, 2] as const;

/**
 * OID: 1.2.840.113549.1.3
 */
export const OID_PKCS_3 = [...OID_PKCS, 3] as const;

/**
 * Length of: OID_PKCS_3
 */
export const OID_PKCS_3_LENGTH = OID_PKCS_3.length;

/**
 * OID: 1.2.840.113549.1.4
 */
export const OID_PKCS_4 = [...OID_PKCS, 4] as const;

/**
 * OID: 1.2.840.113549.1.5
 */
export const OID_PKCS_5 = [...OID_PKCS, 5] as const;

/**
 * Length of: OID_PKCS_5
 */
export const OID_PKCS_5_LENGTH = OID_PKCS_5.length;

/**
 * OID: 1.2.840.113549.1.6
 */
export const OID_PKCS_6 = [...OID_PKCS, 6] as const;

/**
 * OID: 1.2.840.113549.1.7
 */
export const OID_PKCS_7 = [...OID_PKCS, 7] as const;

/**
 * Length of: OID_PKCS_7
 */
export const OID_PKCS_7_LENGTH = OID_PKCS_7.length;

/**
 * OID: 1.2.840.113549.1.8
 */
export const OID_PKCS_8 = [...OID_PKCS, 8] as const;

/**
 * OID: 1.2.840.113549.1.9
 */
export const OID_PKCS_9 = [...OID_PKCS, 9] as const;

/**
 * Length of: OID_PKCS_9
 */
export const OID_PKCS_9_LENGTH = OID_PKCS_9.length;

/**
 * OID: 1.2.840.113549.1.10
 */
export const OID_PKCS_10 = [...OID_PKCS, 10] as const;

/**
 * OID: 1.2.840.113549.1.11
 */
export const OID_PKCS_11 = [...OID_PKCS, 11] as const;

/**
 * Length of: OID_PKCS_11
 */
export const OID_PKCS_11_LENGTH = OID_PKCS_11.length;

/**
 * OID: 1.2.840.113549.1.12
 */
export const OID_PKCS_12 = [...OID_PKCS, 12] as const;

/**
 * Length of: OID_PKCS_12
 */
export const OID_PKCS_12_LENGTH = OID_PKCS_12.length;

// ANSI X9.42:

/**
 * OID: 1.2.840.10046.2
 */
export const OID_ANSI_X9_42 = [...OID_US, 206, 62, 2] as const;

/**
 * Length of: OID_ANSI_X9_42
 */
export const OID_ANSI_X9_42_LEN = OID_ANSI_X9_42.length;

/**
 * OID: 1.2.840.10046.2.3
 */
export const OID_ANSI_X9_42_SCHEME = [...OID_ANSI_X9_42, 3] as const;

/**
 * Length of: OID_ANSI_X9_42_SCHEME
 */
export const OID_ANSI_X9_42_SCHEME_LEN = OID_ANSI_X9_42_SCHEME.length;

/**
 * OID: 1.2.840.10046.2.4
 */
export const OID_ANSI_X9_42_NAMED_SCHEME = [...OID_ANSI_X9_42, 4] as const;

/**
 * Length of: OID_ANSI_X9_42_NAMED_SCHEME
 */
export const OID_ANSI_X9_42_NAMED_SCHEME_LEN =
	OID_ANSI_X9_42_NAMED_SCHEME.length;

// ANSI X9.62 (1 2 840 10045):

/**
 * OID: 1.2.840.10045
 */
export const OID_ANSI_X9_62 = [0x2A, 0x86, 0x48, 0xCE, 0x3D] as const;

/**
 * Length of: OID_ANSI_X9_62
 */
export const OID_ANSI_X9_62_LEN = OID_ANSI_X9_62.length;

/**
 * OID: 1.2.840.10045.1
 */
export const OID_ANSI_X9_62_FIELD_TYPE = [...OID_ANSI_X9_62, 1] as const;

/**
 * OID: 1.2.840.10045.2
 */
export const OID_ANSI_X9_62_PUBKEY_TYPE = [...OID_ANSI_X9_62, 2] as const;

/**
 * OID: 1.2.840.10045.3
 */
export const OID_ANSI_X9_62_ELL_CURVE = [...OID_ANSI_X9_62, 3] as const;

/**
 * Length of: OID_ANSI_X9_62_ELL_CURVE
 */
export const OID_ANSI_X9_62_ELL_CURVE_LEN = OID_ANSI_X9_62_ELL_CURVE.length;

/**
 * OID: 1.2.840.10045.3.0
 */
export const OID_ANSI_X9_62_C_TWO_CURVE = [
	...OID_ANSI_X9_62_ELL_CURVE,
	0,
] as const;

/**
 * OID: 1.2.840.10045.3.1
 */
export const OID_ANSI_X9_62_PRIME_CURVE = [
	...OID_ANSI_X9_62_ELL_CURVE,
	1,
] as const;

/**
 * OID: 1.2.840.10045.4
 */
export const OID_ANSI_X9_62_SIG_TYPE = [...OID_ANSI_X9_62, 4] as const;

/**
 * Length of: OID_ANSI_X9_62_SIG_TYPE
 */
export const OID_ANSI_X9_62_SIG_TYPE_LEN = OID_ANSI_X9_62_SIG_TYPE.length;

// PKIX:

/**
 * OID: 1.3.6.1.5.5.7
 */
export const OID_PKIX = [...OID_DOD, 1, 5, 5, 7] as const;

/**
 * Length of: OID_PKIX
 */
export const OID_PKIX_LENGTH = OID_PKIX.length;

/**
 * OID: 1.3.6.1.5.5.7.1
 */
export const OID_PE = [...OID_PKIX, 1] as const;

/**
 * Length of: OID_PE
 */
export const OID_PE_LENGTH = OID_PE.length;

/**
 * OID: 1.3.6.1.5.5.7.2
 */
export const OID_QT = [...OID_PKIX, 2] as const;

/**
 * Length of: OID_QT
 */
export const OID_QT_LENGTH = OID_QT.length;

/**
 * OID: 1.3.6.1.5.5.7.3
 */
export const OID_KP = [...OID_PKIX, 3] as const;

/**
 * Length of: OID_KP
 */
export const OID_KP_LENGTH = OID_KP.length;

/**
 * OID: 1.3.6.1.5.5.7.8
 */
export const OID_OTHER_NAME = [...OID_PKIX, 8] as const;

/**
 * Length of: OID_OTHER_NAME
 */
export const OID_OTHER_NAME_LENGTH = OID_OTHER_NAME.length;

/**
 * OID: 1.3.6.1.5.5.7.9
 */
export const OID_PDA = [...OID_PKIX, 9] as const;

/**
 * Length of: OID_PDA
 */
export const OID_PDA_LENGTH = OID_PDA.length;

/**
 * OID: 1.3.6.1.5.5.7.11
 */
export const OID_QCS = [...OID_PKIX, 11] as const;

/**
 * Length of: OID_QCS
 */
export const OID_QCS_LENGTH = OID_QCS.length;

/**
 * OID: 1.3.6.1.5.5.7.48
 */
export const OID_AD = [...OID_PKIX, 48] as const;

/**
 * Length of: OID_AD
 */
export const OID_AD_LENGTH = OID_AD.length;

/**
 * OID: 1.3.6.1.5.5.7.48.1
 */
export const OID_AD_OCSP = [...OID_AD, 1] as const;

/**
 * Length of: OID_AD_OCSP
 */
export const OID_AD_OCSP_LENGTH = OID_AD_OCSP.length;

// ETSI:

/**
 * OID: 0.4.0
 */
export const OID_ETSI = [0x04, 0x00] as const;

/**
 * Length of: OID_ETSI
 */
export const OID_ETSI_LENGTH = OID_ETSI.length;

/**
 * OID: 0.4.0.1862.1
 */
export const OID_ETSI_QCS = [0x04, 0x00, 0x8E, 0x46, 0x01] as const;

/**
 * Length of: OID_ETSI_QCS
 */
export const OID_ETSI_QCS_LENGTH = OID_ETSI_QCS.length;

/**
 * OID: 1.3.14.3
 */
export const OID_OIW_SECSIG = [...OID_OIW, 3] as const;

/**
 * Length of: OID_OIW
 */
export const OID_OIW_LENGTH = OID_OIW.length;

/**
 * Length of: OID_OIW_SECSIG
 */
export const OID_OIW_SECSIG_LENGTH = OID_OIW_SECSIG.length;

/**
 * OID: 1.3.14.3.2
 */
export const OID_OIW_ALGORITHM = [...OID_OIW_SECSIG, 2] as const;

/**
 * Length of: OID_OIW_ALGORITHM
 */
export const OID_OIW_ALGORITHM_LENGTH = OID_OIW_ALGORITHM.length;

// NIST (2, 16, 840, 1, 101, 3, 4, 2):

/**
 * OID: 2.16.840.1.101.3.4.2
 */
export const OID_NIST_HASHALG = [
	0x60,
	0x86,
	0x48,
	0x01,
	0x65,
	0x03,
	0x04,
	0x02,
] as const;

/**
 * Length of: OID_NIST_HASHALG
 */
export const OID_NIST_HASHALG_LENGTH = OID_NIST_HASHALG.length;

// Kerberos PKINIT:

/**
 * OID: 1.3.6.1.5.2
 */
export const OID_KERBv5 = [0x2b, 6, 1, 5, 2] as const;

/**
 * Length of: OID_KERBv5
 */
export const OID_KERBv5_LEN = OID_KERBv5.length;

/**
 * OID: 1.3.6.1.5.2.3
 */
export const OID_KERBv5_PKINIT = [...OID_KERBv5, 3] as const;

/**
 * Length of: OID_KERBv5_PKINIT
 */
export const OID_KERBv5_PKINIT_LEN = OID_KERBv5_PKINIT.length;

// Certicom (1 3 132):

/**
 * OID: 1.3.132
 */
export const OID_CERTICOM = [0x2B, 0x81, 0x04] as const;

/**
 * Length of: OID_CERTICOM
 */
export const OID_CERTICOM_LEN = OID_CERTICOM.length;

/**
 * OID: 1.3.132.0
 */
export const OID_CERTICOM_ELL_CURVE = [...OID_CERTICOM, 0] as const;

/**
 * Length of: OID_CERTICOM_ELL_CURVE
 */
export const OID_CERTICOM_ELL_CURVE_LEN = OID_CERTICOM_ELL_CURVE.length;
