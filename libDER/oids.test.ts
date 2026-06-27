import { assertEquals, assertInstanceOf } from '@std/assert';
import {
	SecCertificateCreateOidDataFromString,
} from '../Security/SecCertificateInternal.ts';
import * as C from './oids.ts';

const entries = <T extends Record<string, unknown>>(obj: T) =>
	Object.entries(obj) as [keyof T, T[keyof T]][];

const oids = {
	oidRsa: '1.2.840.113549.1.1.1',
	oidMd2Rsa: '1.2.840.113549.1.1.2',
	oidMd4Rsa: '1.2.840.113549.1.1.3',
	oidMd5Rsa: '1.2.840.113549.1.1.4',
	oidSha1Rsa: '1.2.840.113549.1.1.5',
	oidSha256Rsa: '1.2.840.113549.1.1.11',
	oidSha384Rsa: '1.2.840.113549.1.1.12',
	oidSha512Rsa: '1.2.840.113549.1.1.13',
	oidSha224Rsa: '1.2.840.113549.1.1.14',
	oidEcPubKey: '1.2.840.10045.2.1',
	oidSha1Ecdsa: '1.2.840.10045.4.1',
	oidSha224Ecdsa: '1.2.840.10045.4.3.1',
	oidSha256Ecdsa: '1.2.840.10045.4.3.2',
	oidSha384Ecdsa: '1.2.840.10045.4.3.3',
	oidSha512Ecdsa: '1.2.840.10045.4.3.4',
	oidSha1Dsa: '1.2.840.10040.4.3',
	oidMd2: '1.2.840.113549.2.2',
	oidMd4: '1.2.840.113549.2.4',
	oidMd5: '1.2.840.113549.2.5',
	oidSha1: '1.3.14.3.2.26',
	oidSha1RsaOIW: '1.3.14.3.2.29',
	oidSha1DsaOIW: '1.3.14.3.2.27',
	oidSha1DsaCommonOIW: '1.3.14.3.2.28',
	oidSha256: '2.16.840.1.101.3.4.2.1',
	oidSha384: '2.16.840.1.101.3.4.2.2',
	oidSha512: '2.16.840.1.101.3.4.2.3',
	oidSha224: '2.16.840.1.101.3.4.2.4',
	oidFee: '1.2.840.113635.100.2.1',
	oidMd5Fee: '1.2.840.113635.100.2.3',
	oidSha1Fee: '1.2.840.113635.100.2.4',
	oidEcPrime192v1: '1.2.840.10045.3.1.1',
	oidEcPrime256v1: '1.2.840.10045.3.1.7',
	oidAnsip384r1: '1.3.132.0.34',
	oidAnsip521r1: '1.3.132.0.35',
	oidSubjectKeyIdentifier: '2.5.29.14',
	oidKeyUsage: '2.5.29.15',
	oidPrivateKeyUsagePeriod: '2.5.29.16',
	oidSubjectAltName: '2.5.29.17',
	oidIssuerAltName: '2.5.29.18',
	oidBasicConstraints: '2.5.29.19',
	oidNameConstraints: '2.5.29.30',
	oidCrlDistributionPoints: '2.5.29.31',
	oidCertificatePolicies: '2.5.29.32',
	oidAnyPolicy: '2.5.29.32.0',
	oidPolicyMappings: '2.5.29.33',
	oidAuthorityKeyIdentifier: '2.5.29.35',
	oidPolicyConstraints: '2.5.29.36',
	oidExtendedKeyUsage: '2.5.29.37',
	oidAnyExtendedKeyUsage: '2.5.29.37.0',
	oidInhibitAnyPolicy: '2.5.29.54',
	oidAuthorityInfoAccess: '1.3.6.1.5.5.7.1.1',
	oidSubjectInfoAccess: '1.3.6.1.5.5.7.1.11',
	oidAdOCSP: '1.3.6.1.5.5.7.48.1',
	oidAdCAIssuer: '1.3.6.1.5.5.7.48.2',
	oidNetscapeCertType: '2.16.840.1.113730.1.1',
	oidEntrustVersInfo: '1.2.840.113533.7.65.0',
	oidMSNTPrincipalName: '1.3.6.1.4.1.311.20.2.3',
	oidQtCps: '1.3.6.1.5.5.7.2.1',
	oidQtUNotice: '1.3.6.1.5.5.7.2.2',
	oidCommonName: '2.5.4.3',
	oidCountryName: '2.5.4.6',
	oidLocalityName: '2.5.4.7',
	oidStateOrProvinceName: '2.5.4.8',
	oidOrganizationName: '2.5.4.10',
	oidOrganizationalUnitName: '2.5.4.11',
	oidDescription: '2.5.4.13',
	oidEmailAddress: '1.2.840.113549.1.9.1',
	oidFriendlyName: '1.2.840.113549.1.9.20',
	oidLocalKeyId: '1.2.840.113549.1.9.21',
	oidExtendedKeyUsageServerAuth: '1.3.6.1.5.5.7.3.1',
	oidExtendedKeyUsageClientAuth: '1.3.6.1.5.5.7.3.2',
	oidExtendedKeyUsageCodeSigning: '1.3.6.1.5.5.7.3.3',
	oidExtendedKeyUsageEmailProtection: '1.3.6.1.5.5.7.3.4',
	oidExtendedKeyUsageTimeStamping: '1.3.6.1.5.5.7.3.8',
	oidExtendedKeyUsageOCSPSigning: '1.3.6.1.5.5.7.3.9',
	oidExtendedKeyUsageIPSec: '1.3.6.1.5.5.8.2.2',
	oidExtendedKeyUsageMicrosoftSGC: '1.3.6.1.4.1.311.10.3.3',
	oidExtendedKeyUsageNetscapeSGC: '2.16.840.1.113730.4.1',
	oidAppleSecureBootCertSpec: '1.2.840.113635.100.6.1.1',
	oidAppleSecureBootTicketCertSpec: '1.2.840.113635.100.6.1.11',
	oidAppleImg4ManifestCertSpec: '1.2.840.113635.100.6.1.15',
	oidAppleProvisioningProfile: '1.2.840.113635.100.6.2.1',
	oidAppleApplicationSigning: '1.2.840.113635.100.6.1.3',
	oidAppleInstallerPackagingSigningExternal: '1.2.840.113635.100.6.1.16',
	oidAppleTVOSApplicationSigningProd: '1.2.840.113635.100.6.1.24',
	oidAppleTVOSApplicationSigningProdQA: '1.2.840.113635.100.6.1.24.1',
	oidAppleExtendedKeyUsageCodeSigning: '1.2.840.113635.100.4.1',
	oidAppleExtendedKeyUsageCodeSigningDev: '1.2.840.113635.100.4.1.1',
	oidAppleExtendedKeyUsageAppleID: '1.2.840.113635.100.4.7',
	oidAppleExtendedKeyUsagePassbook: '1.2.840.113635.100.4.14',
	oidAppleExtendedKeyUsageProfileSigning: '1.2.840.113635.100.4.16',
	oidAppleExtendedKeyUsageQAProfileSigning: '1.2.840.113635.100.4.17',
	oidAppleIntmMarkerAppleWWDR: '1.2.840.113635.100.6.2.1',
	oidAppleIntmMarkerAppleID: '1.2.840.113635.100.6.2.3',
	oidAppleIntmMarkerAppleID2: '1.2.840.113635.100.6.2.7',
	oidApplePushServiceClient: '1.2.840.113635.100.6.2.7',
	oidApplePolicyMobileStore: '1.2.840.113635.100.5.12',
	oidApplePolicyMobileStoreProdQA: '1.2.840.113635.100.5.12.1',
	oidApplePolicyEscrowService: '1.2.840.113635.100.6.23.1',
	oidAppleCertExtensionAppleIDRecordValidationSigning:
		'1.2.840.113635.100.6.25',
	oidAppleCertExtOSXProvisioningProfileSigning: '1.2.840.113635.100.4.11',
	oidAppleIntmMarkerAppleSystemIntg2: '1.2.840.113635.100.6.2.10',
	oidAppleIntmMarkerAppleSystemIntgG3: '1.2.840.113635.100.6.2.13',
	oidAppleCertExtAppleSMPEncryption: '1.2.840.113635.100.6.30',
	oidAppleCertExtAppleServerAuthentication: '1.2.840.113635.100.6.27.1',
	oidAppleCertExtAppleServerAuthenticationIDSProdQA:
		'1.2.840.113635.100.6.27.4.1',
	oidAppleCertExtAppleServerAuthenticationIDSProd:
		'1.2.840.113635.100.6.27.4.2',
	oidAppleCertExtAppleServerAuthenticationAPNProdQA:
		'1.2.840.113635.100.6.27.5.1',
	oidAppleCertExtAppleServerAuthenticationAPNProd:
		'1.2.840.113635.100.6.27.5.2',
	oidAppleCertExtAppleServerAuthenticationGS: '1.2.840.113635.100.6.27.2',
	oidAppleCertExtAppleServerAuthenticationPPQProdQA:
		'1.2.840.113635.100.6.27.3.1',
	oidAppleCertExtAppleServerAuthenticationPPQProd:
		'1.2.840.113635.100.6.27.3.2',
	oidAppleIntmMarkerAppleServerAuthentication: '1.2.840.113635.100.6.2.12',
	oidAppleCertExtApplePPQSigningProd: '1.2.840.113635.100.6.38.2',
	oidAppleCertExtApplePPQSigningProdQA: '1.2.840.113635.100.6.38.1',
	oidGoogleEmbeddedSignedCertificateTimestamp: '1.3.6.1.4.1.11129.2.4.2',
	oidGoogleOCSPSignedCertificateTimestamp: '1.3.6.1.4.1.11129.2.4.5',
	oidAppleCertExtATVAppSigningProd: '1.2.840.113635.100.6.1.24',
	oidAppleCertExtATVAppSigningProdQA: '1.2.840.113635.100.6.1.24.1',
	oidAppleCertExtATVVPNProfileSigning: '1.2.840.113635.100.6.43',
	oidAppleCertExtCryptoServicesExtEncryption: '1.2.840.113635.100.6.39',
	oidAppleCertExtAST2DiagnosticsServerAuthProdQA:
		'1.2.840.113635.100.6.27.8.1',
	oidAppleCertExtAST2DiagnosticsServerAuthProd: '1.2.840.113635.100.6.27.8.2',
	oidAppleCertExtEscrowProxyServerAuthProdQA: '1.2.840.113635.100.6.27.7.1',
	oidAppleCertExtEscrowProxyServerAuthProd: '1.2.840.113635.100.6.27.7.2',
	oidAppleCertExtFMiPServerAuthProdQA: '1.2.840.113635.100.6.27.6.1',
	oidAppleCertExtFMiPServerAuthProd: '1.2.840.113635.100.6.27.6.2',
	oidAppleCertExtHomeKitServerAuth: '1.2.840.113635.100.6.27.9',
	oidAppleIntmMarkerAppleHomeKitServerCA: '1.2.840.113635.100.6.2.16',
	oidAppleCertExtAppleServerAuthenticationMMCSProdQA:
		'1.2.840.113635.100.6.27.11.1',
	oidAppleCertExtAppleServerAuthenticationMMCSProd:
		'1.2.840.113635.100.6.27.11.2',
	oidAppleCertExtAppleServerAuthenticationiCloudSetupProdQA:
		'1.2.840.113635.100.6.27.15.1',
	oidAppleCertExtAppleServerAuthenticationiCloudSetupProd:
		'1.2.840.113635.100.6.27.15.2',
} as const;

Deno.test('OID constants', () => {
	// Check OIDs against their expected values.
	for (const [K, V] of entries(oids)) {
		const dec = SecCertificateCreateOidDataFromString(V);
		assertInstanceOf(dec, Uint8Array);
		const item = C[K];
		assertEquals(
			new Uint8Array(
				item.data!.buffer,
				item.data!.byteOffset,
				item.length,
			),
			dec,
			K,
		);
	}
});
