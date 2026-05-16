import { assertEquals, assertInstanceOf } from '@std/assert';
import {
	SecCertificateCreateOidDataFromString,
} from '../sec/SecCertificate.ts';
import * as C from './oidsbase.ts';

Deno.test('OID constants', () => {
	const consts = {
		INTEL: '2.16.840.1.113741',
		INTEL_CDSASECURITY: '2.16.840.1.113741.2',
		INTEL_SEC_FORMATS: '2.16.840.1.113741.2.1',
		INTEL_SEC_ALGS: '2.16.840.1.113741.2.2.5',
		INTEL_SEC_OBJECT_BUNDLE: '2.16.840.1.113741.2.1.4',
		INTEL_CERT_AND_PRIVATE_KEY_2_0: '2.16.840.1.113741.2.1.4.1',
		OID_ISO_CCITT_DIR_SERVICE: '2.5',
		OID_ATTR_TYPE: '2.5.4',
		OID_EXTENSION: '2.5.29',
		OID_ISO_STANDARD: '1.0',
		OID_ISO_MEMBER: '1.2',
		OID_US: '1.2.840',
		OID_ISO_IDENTIFIED_ORG: '1.3',
		OID_OSINET: '1.3.4',
		OID_GOSIP: '1.3.5',
		OID_DOD: '1.3.6',
		OID_OIW: '1.3.14',
		OID_ITU_RFCDATA: '0.9',

		OID_RSA: '1.2.840.113549',
		OID_RSA_HASH: '1.2.840.113549.2',
		OID_RSA_ENCRYPT: '1.2.840.113549.3',
		OID_PKCS: '1.2.840.113549.1',
		OID_PKCS_1: '1.2.840.113549.1.1',
		OID_PKCS_2: '1.2.840.113549.1.2',
		OID_PKCS_3: '1.2.840.113549.1.3',
		OID_PKCS_4: '1.2.840.113549.1.4',
		OID_PKCS_5: '1.2.840.113549.1.5',
		OID_PKCS_6: '1.2.840.113549.1.6',
		OID_PKCS_7: '1.2.840.113549.1.7',
		OID_PKCS_8: '1.2.840.113549.1.8',
		OID_PKCS_9: '1.2.840.113549.1.9',
		OID_PKCS_10: '1.2.840.113549.1.10',
		OID_PKCS_11: '1.2.840.113549.1.11',
		OID_PKCS_12: '1.2.840.113549.1.12',

		OID_ANSI_X9_42: '1.2.840.10046.2',
		OID_ANSI_X9_42_SCHEME: '1.2.840.10046.2.3',
		OID_ANSI_X9_42_NAMED_SCHEME: '1.2.840.10046.2.4',

		OID_ANSI_X9_62: '1.2.840.10045',
		OID_ANSI_X9_62_FIELD_TYPE: '1.2.840.10045.1',
		OID_ANSI_X9_62_PUBKEY_TYPE: '1.2.840.10045.2',
		OID_ANSI_X9_62_ELL_CURVE: '1.2.840.10045.3',
		OID_ANSI_X9_62_C_TWO_CURVE: '1.2.840.10045.3.0',
		OID_ANSI_X9_62_PRIME_CURVE: '1.2.840.10045.3.1',
		OID_ANSI_X9_62_SIG_TYPE: '1.2.840.10045.4',

		OID_PKIX: '1.3.6.1.5.5.7',
		OID_PE: '1.3.6.1.5.5.7.1',
		OID_QT: '1.3.6.1.5.5.7.2',
		OID_KP: '1.3.6.1.5.5.7.3',
		OID_OTHER_NAME: '1.3.6.1.5.5.7.8',
		OID_PDA: '1.3.6.1.5.5.7.9',
		OID_QCS: '1.3.6.1.5.5.7.11',
		OID_AD: '1.3.6.1.5.5.7.48',
		OID_AD_OCSP: '1.3.6.1.5.5.7.48.1',

		OID_ETSI: '0.4.0',
		OID_ETSI_QCS: '0.4.0.1862.1',
		OID_OIW_SECSIG: '1.3.14.3',
		OID_OIW_ALGORITHM: '1.3.14.3.2',

		OID_NIST_HASHALG: '2.16.840.1.101.3.4.2',

		OID_KERBv5: '1.3.6.1.5.2',
		OID_KERBv5_PKINIT: '1.3.6.1.5.2.3',

		OID_CERTICOM: '1.3.132',
		OID_CERTICOM_ELL_CURVE: '1.3.132.0',
	} as const;

	for (
		const [K, V] of Object.entries(consts) as [
			keyof typeof consts,
			string,
		][]
	) {
		assertEquals(
			SecCertificateCreateOidDataFromString(V),
			new Uint8Array(C[K]),
			K,
		);
	}

	for (const [K, V] of Object.entries(C)) {
		let l = 0;
		if (K === 'OID_ITU_RFCDATA_MEMBER_LENGTH') {
			l = 14;
		} else if (K.endsWith('_LENGTH')) {
			l = 7;
		} else if (K.endsWith('_LEN')) {
			l = 4;
		}
		if (!l) {
			continue;
		}
		const A = (C as unknown as Record<string, number[]>)[K.slice(0, -l)];
		assertInstanceOf(A, Array, K);
		assertEquals(V as number, A.length, K);
	}
});
