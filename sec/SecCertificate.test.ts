import { assertEquals, assertInstanceOf } from '@std/assert';
import { INT32_MAX, INT32_MIN, UINT32_MAX } from '../libc/stdint.ts';
import { digest } from '../spec/hash.ts';
import {
	__SecCertificate,
	GetDecimalValueOfString,
	SecCertificateCopyIssuerSHA256Digest,
	SecCertificateCopySHA1Digest,
	SecCertificateCreateOidDataFromString,
	SecCertificateIsOidString,
} from './SecCertificate.ts';
import { Int32Ptr, Uint8Ptr } from '@hqtsm/struct';

export const ABCD = new Uint8Array([...'ABCD'].map((c) => c.charCodeAt(0)));

Deno.test('SecCertificateCopySHA1Digest', async () => {
	const sc = new __SecCertificate();
	assertEquals(await SecCertificateCopySHA1Digest(null), null);
	assertEquals(await SecCertificateCopySHA1Digest(sc), null);

	sc._der.data = new Uint8Ptr(new ArrayBuffer(0));
	sc._der.length = INT32_MAX + 1;
	assertEquals(await SecCertificateCopySHA1Digest(sc), null);

	sc._der.data = new Uint8Ptr(ABCD.buffer);
	sc._der.length = ABCD.byteLength;
	const digested = await SecCertificateCopySHA1Digest(sc);
	assertInstanceOf(digested, ArrayBuffer);
	assertEquals(new Uint8Array(digested), digest('sha1', ABCD));
});

Deno.test('SecCertificateCopyIssuerSHA256Digest', async () => {
	const sc = new __SecCertificate();
	assertEquals(await SecCertificateCopyIssuerSHA256Digest(null), null);
	assertEquals(await SecCertificateCopyIssuerSHA256Digest(sc), null);

	sc._der.data = new Uint8Ptr(new ArrayBuffer(0));
	sc._der.length = INT32_MAX + 1;
	assertEquals(await SecCertificateCopyIssuerSHA256Digest(sc), null);

	sc._der.data = new Uint8Ptr(ABCD.buffer);
	sc._der.length = ABCD.byteLength;
	const digested = await SecCertificateCopyIssuerSHA256Digest(sc);
	assertInstanceOf(digested, ArrayBuffer);
	assertEquals(new Uint8Array(digested), digest('sha256', ABCD));
});

Deno.test('GetDecimalValueOfString', () => {
	const value = new Int32Ptr(new ArrayBuffer(4));
	value[0] = 42;
	assertEquals(GetDecimalValueOfString('', value), false);
	assertEquals(value[0], 42);
	assertEquals(GetDecimalValueOfString('.', value), false);
	assertEquals(value[0], 42);
	assertEquals(GetDecimalValueOfString('1234', value), true);
	assertEquals(value[0], 1234);
	assertEquals(GetDecimalValueOfString(String(UINT32_MAX), value), true);
	assertEquals(value[0], -1);
	assertEquals(GetDecimalValueOfString(String(INT32_MAX), value), true);
	assertEquals(value[0], INT32_MAX);
	assertEquals(GetDecimalValueOfString(String(INT32_MAX + 1), value), true);
	assertEquals(value[0], INT32_MIN);
});

Deno.test('SecCertificateIsOidString', () => {
	assertEquals(SecCertificateIsOidString(null), false);
	assertEquals(SecCertificateIsOidString(''), false);
	assertEquals(SecCertificateIsOidString('.'), false);
	assertEquals(SecCertificateIsOidString('0.'), false);
	assertEquals(SecCertificateIsOidString('1.'), false);
	assertEquals(SecCertificateIsOidString('2.'), false);
	assertEquals(SecCertificateIsOidString('3.'), false);

	assertEquals(SecCertificateIsOidString('1.2'), true);
	assertEquals(SecCertificateIsOidString('1.2.'), true);
	assertEquals(SecCertificateIsOidString('1.2.3'), true);

	assertEquals(SecCertificateIsOidString('2.0'), true);

	assertEquals(SecCertificateIsOidString('3.0'), false);
});

Deno.test('SecCertificateCreateOidDataFromString', () => {
	assertEquals(SecCertificateCreateOidDataFromString(''), null);
	assertEquals(SecCertificateCreateOidDataFromString('1.'), null);
	assertEquals(SecCertificateCreateOidDataFromString('1.40'), null);
	assertEquals(SecCertificateCreateOidDataFromString('3.0'), null);

	assertEquals(
		SecCertificateCreateOidDataFromString('0.39'),
		new Uint8Array([39]),
	);
	assertEquals(
		SecCertificateCreateOidDataFromString('1.0'),
		new Uint8Array([40]),
	);
	assertEquals(
		SecCertificateCreateOidDataFromString('1.39'),
		new Uint8Array([40 + 39]),
	);
	assertEquals(
		SecCertificateCreateOidDataFromString('2.39'),
		new Uint8Array([80 + 39]),
	);
	assertEquals(
		SecCertificateCreateOidDataFromString('1.39.'),
		new Uint8Array([40 + 39]),
	);
	assertEquals(
		SecCertificateCreateOidDataFromString('1.39..123'),
		new Uint8Array([40 + 39]),
	);
	assertEquals(
		SecCertificateCreateOidDataFromString('1.39.127'),
		new Uint8Array([40 + 39, 127]),
	);
	assertEquals(
		SecCertificateCreateOidDataFromString('1.39.128'),
		new Uint8Array([40 + 39, 0x81, 0x00]),
	);
	assertEquals(
		SecCertificateCreateOidDataFromString('1.39.129'),
		new Uint8Array([40 + 39, 0x81, 0x01]),
	);
	assertEquals(
		SecCertificateCreateOidDataFromString(`1.39.${0x76543210}`),
		new Uint8Array([40 + 39, 0x87, 0xB2, 0xD0, 0xE4, 0x10]),
	);
	assertEquals(
		SecCertificateCreateOidDataFromString(`1.39.${0x7FFFFFFF}`),
		new Uint8Array([40 + 39, 0x87, 0xFF, 0xFF, 0xFF, 0x7F]),
	);
});
