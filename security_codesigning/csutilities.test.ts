import { Uint8Ptr } from '@hqtsm/struct';
import { assertEquals } from '@std/assert';
import { kCCDigestSHA1 } from '../CommonCrypto/CommonDigestSPI.ts';
import { cssm_data } from '../Security/SecAsn1Types.ts';
import {
	__SecCertificate,
	SecCertificateCreateOidDataFromString,
	SecCertificateExtension,
} from '../Security/SecCertificate.ts';
import { Security_CCHashInstance } from '../security_utilities/hashing.ts';
import { unhex } from '../spec/hex.ts';
import {
	Security_CodeSigning_certificateHasField,
	Security_CodeSigning_hashFileData,
	Security_CodeSigning_isAppleCA,
} from './csutilities.ts';

export const ABCD = new Uint8Array([...'ABCD'].map((c) => c.charCodeAt(0)));

const AppleRootCAHash =
	'b0b1730ecbc7ff4505142c49f1295e6eda6bcaed7e2c68c5be91b5a11001f024';

Deno.test('Security_CodeSigning_isAppleCA', async () => {
	const sc = new __SecCertificate();
	assertEquals(await Security_CodeSigning_isAppleCA(sc), false);
	sc._der.data = new Uint8Ptr(new ArrayBuffer(100));
	sc._der.length = 100;
	assertEquals(
		await Security_CodeSigning_isAppleCA(sc, {
			/**
			 * Return specific hash.
			 *
			 * @returns Promise.
			 */
			digest(): Promise<ArrayBuffer> {
				return Promise.resolve(unhex(AppleRootCAHash).buffer);
			},
		}),
		true,
	);
});

Deno.test('Security_CodeSigning_hashFileData: full', async () => {
	const data = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]);
	const expected = new Uint8Array(
		await crypto.subtle.digest('SHA-1', data),
	);

	const hasher = new Security_CCHashInstance(kCCDigestSHA1);
	const size = await Security_CodeSigning_hashFileData(
		new Blob([data]),
		hasher,
	);
	assertEquals(size, 8);
	const digest = new Uint8Array(hasher.digestLength());
	await hasher.finish(digest);

	assertEquals(digest, expected);
});

Deno.test('Security_CodeSigning_hashFileData: limit', async () => {
	const data = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]);
	const expected = new Uint8Array(
		await crypto.subtle.digest('SHA-1', data.slice(0, 4)),
	);

	const hasher = new Security_CCHashInstance(kCCDigestSHA1);
	const size = await Security_CodeSigning_hashFileData(
		new Blob([data]),
		hasher,
		4,
	);
	assertEquals(size, 4);
	const digest = new Uint8Array(hasher.digestLength());
	await hasher.finish(digest);

	assertEquals(digest, expected);
});

Deno.test('Security_CodeSigning_certificateHasField', () => {
	const sce = new SecCertificateExtension();
	const sc = new __SecCertificate();
	const oid = '1.2.3';
	const oidData = SecCertificateCreateOidDataFromString(oid)!;

	sce.extnID.data = new Uint8Ptr(oidData.buffer);
	sce.extnID.length = oidData.byteLength;
	sce.critical = true;
	sce.extnValue.data = new Uint8Ptr(ABCD.buffer.slice());
	sce.extnValue.length = ABCD.byteLength;

	sc._extensionCount = 1;
	sc._extensions = [sce];

	const cssm = new cssm_data();
	cssm.Data = new Uint8Ptr(oidData.buffer.slice());
	cssm.Length = oidData.byteLength;
	assertEquals(Security_CodeSigning_certificateHasField(null, cssm), false);
	assertEquals(Security_CodeSigning_certificateHasField(sc, cssm), true);
});
