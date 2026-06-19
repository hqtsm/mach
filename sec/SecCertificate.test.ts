import { Uint8Ptr } from '@hqtsm/struct';
import { assertEquals, assertInstanceOf } from '@std/assert';
import { kCFStringEncodingASCII } from '../CoreFoundation/CFString.ts';
import { INT32_MAX, INT32_MIN, UINT32_MAX } from '../libc/stdint.ts';
import { ASN1_BOOLEAN, ASN1_INTEGER } from '../libDER/asn1Types.ts';
import { DERItem } from '../libDER/DERItem.ts';
import { digest } from '../spec/hash.ts';
import {
	__SecCertificate,
	copyBlobString,
	copyContentString,
	copyDERThingContentDescription,
	copyHexDescription,
	copyOidDescription,
	GetDecimalValueOfString,
	SecCertificateCopyExtensionValue,
	SecCertificateCopyIssuerSHA256Digest,
	SecCertificateCopySHA1Digest,
	SecCertificateCreateOidDataFromString,
	SecCertificateExtension,
	SecCertificateIsOidString,
	SecDERItemCopyOIDDecimalRepresentation,
} from './SecCertificate.ts';
import {
	SEC_BYTE_STRING_KEY,
	SEC_BYTES_KEY,
	SEC_NULL_KEY,
	SEC_OID_TOO_LONG_KEY,
} from './SecFrameworkStrings.ts';

export const ABCD = new Uint8Array([...'ABCD'].map((c) => c.charCodeAt(0)));
export const ABCD0 = new Uint8Array([...'ABCD\0'].map((c) => c.charCodeAt(0)));

Deno.test('SecDERItemCopyOIDDecimalRepresentation', () => {
	assertEquals(
		SecDERItemCopyOIDDecimalRepresentation(
			new DERItem(new Uint8Ptr(new ArrayBuffer()), 0),
		),
		SEC_NULL_KEY,
	);
	assertEquals(
		SecDERItemCopyOIDDecimalRepresentation(
			new DERItem(new Uint8Ptr(new ArrayBuffer()), 33),
		),
		SEC_OID_TOO_LONG_KEY,
	);
	assertEquals(
		SecDERItemCopyOIDDecimalRepresentation(
			new DERItem(
				new Uint8Ptr(
					new Uint8Array([
						0x2A,
						0x03,
						0x04,
					]).buffer,
				),
				3,
			),
		),
		'1.2.3.4',
	);
	assertEquals(
		SecDERItemCopyOIDDecimalRepresentation(
			new DERItem(
				new Uint8Ptr(
					new Uint8Array([
						0xAA,
						0x03,
						0x04,
					]).buffer,
				),
				3,
			),
		),
		'2.90.3.4',
	);
});

Deno.test('copyOidDescription', () => {
	assertEquals(
		copyOidDescription(
			new DERItem(new Uint8Ptr(new ArrayBuffer()), 0),
			false,
		),
		SEC_NULL_KEY,
	);
	assertEquals(
		copyOidDescription(
			new DERItem(new Uint8Ptr(new ArrayBuffer()), 0),
			true,
		),
		SEC_NULL_KEY,
	);
	assertEquals(
		copyOidDescription(
			new DERItem(
				new Uint8Ptr(
					new Uint8Array([
						0x2A,
						0x03,
						0x04,
					]).buffer,
				),
				3,
			),
			false,
		),
		'1.2.3.4',
	);
});

Deno.test('copyHexDescription', () => {
	const blob = new DERItem(new Uint8Ptr(ABCD.buffer), ABCD.byteLength);
	assertEquals(copyHexDescription(blob), '41 42 43 44');

	assertEquals(
		copyHexDescription(
			new DERItem(new Uint8Ptr(new ArrayBuffer()), INT32_MAX),
		),
		null,
	);
});

Deno.test('copyBlobString', () => {
	const blob = new DERItem(new Uint8Ptr(ABCD.buffer), ABCD.byteLength);
	assertEquals(
		copyBlobString(SEC_BYTE_STRING_KEY, SEC_BYTES_KEY, blob, false),
		'Byte string; 4 bytes; data = 41 42 43 44',
	);
	assertEquals(
		copyBlobString(SEC_BYTE_STRING_KEY, SEC_BYTES_KEY, blob, true),
		'Byte string; 4 bytes; data = 41 42 43 44',
	);
	assertEquals(
		copyBlobString(
			SEC_BYTE_STRING_KEY,
			SEC_BYTES_KEY,
			new DERItem(new Uint8Ptr(new ArrayBuffer()), INT32_MAX),
			true,
		),
		`Byte string; ${INT32_MAX} bytes; data = (null)`,
	);
});

Deno.test('copyContentString', () => {
	assertEquals(
		copyContentString(
			new DERItem(new Uint8Ptr(ABCD.buffer), ABCD.byteLength),
			kCFStringEncodingASCII,
			false,
		),
		'ABCD',
	);
	assertEquals(
		copyContentString(
			new DERItem(new Uint8Ptr(ABCD0.buffer), ABCD0.byteLength),
			kCFStringEncodingASCII,
			false,
		),
		'ABCD',
	);
	assertEquals(
		copyContentString(
			new DERItem(new Uint8Ptr(new ArrayBuffer()), 0),
			kCFStringEncodingASCII,
			true,
		),
		null,
	);
	assertEquals(
		copyContentString(
			new DERItem(new Uint8Ptr(new Uint8Array([0xFF, 0xEE]).buffer), 2),
			kCFStringEncodingASCII,
			true,
		),
		null,
	);
	assertEquals(
		copyContentString(
			new DERItem(new Uint8Ptr(new Uint8Array([0xFF, 0xEE]).buffer), 2),
			kCFStringEncodingASCII,
			false,
		),
		'FF EE',
	);
	assertEquals(
		copyContentString(
			new DERItem(
				new Proxy(new Uint8Ptr(new ArrayBuffer()), {
					get(target, prop): unknown {
						if (typeof prop === 'string' && /^\d+$/.test(prop)) {
							return 1;
						}
						return Reflect.get(target, prop);
					},
				}),
				INT32_MAX + 1,
			),
			kCFStringEncodingASCII,
			false,
		),
		null,
	);
});

Deno.test('copyDERThingContentDescription: int bool', () => {
	assertEquals(
		copyDERThingContentDescription(
			ASN1_BOOLEAN,
			new DERItem(),
			false,
			false,
		),
		'',
	);
	assertEquals(
		copyDERThingContentDescription(
			ASN1_INTEGER,
			new DERItem(
				new Uint8Ptr(
					new Uint8Array([
						0x12,
						0x34,
						0x56,
						0x78,
						0x9A,
						0xBC,
						0xDE,
						0xF0,
						0x0F,
					]).buffer,
				),
				9,
			),
			false,
			false,
		),
		'12 34 56 78 9A BC DE F0 0F',
	);
	assertEquals(
		copyDERThingContentDescription(
			ASN1_INTEGER,
			new DERItem(new Uint8Ptr(ABCD.buffer), ABCD.byteLength),
			false,
			false,
		),
		(0x41424344).toString(),
	);
	assertEquals(
		copyDERThingContentDescription(
			ASN1_INTEGER,
			new DERItem(new Uint8Ptr(ABCD.buffer), ABCD.byteLength),
			true,
			false,
		),
		null,
	);
});

Deno.test('copyDERThingContentDescription', () => {
	assertEquals(
		copyDERThingContentDescription(
			0xFFFFFFFFn,
			null,
			true,
			false,
		),
		null,
	);
	assertEquals(
		copyDERThingContentDescription(
			0xFFFFFFFFn,
			new DERItem(new Uint8Ptr(new ArrayBuffer()), 42),
			true,
			false,
		),
		null,
	);
	assertEquals(
		copyDERThingContentDescription(
			0xFFFFFFFFn,
			new DERItem(new Uint8Ptr(new ArrayBuffer()), 42),
			false,
			false,
		),
		'not displayed (tag = 4294967295; length 42)',
	);
	assertEquals(
		copyDERThingContentDescription(
			0xFFFFFFFFn,
			new DERItem(new Uint8Ptr(new ArrayBuffer()), 42),
			false,
			true,
		),
		'not displayed (tag = 4294967295; length 42)',
	);
});

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
	const value = [42];
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

Deno.test('SecCertificateCopyExtensionValue', () => {
	const b = [false];
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

	assertEquals(SecCertificateCopyExtensionValue(null, null, null), null);
	assertEquals(SecCertificateCopyExtensionValue(sc, null, null), null);
	assertEquals(SecCertificateCopyExtensionValue(sc, '', null), null);
	assertEquals(SecCertificateCopyExtensionValue(sc, 'BAD', null), null);

	assertEquals(SecCertificateCopyExtensionValue(sc, oid, b), ABCD);
	assertEquals(b[0], true);

	sce.critical = false;

	assertEquals(SecCertificateCopyExtensionValue(sc, oidData, b), ABCD);
	assertEquals(b[0], false);

	assertEquals(SecCertificateCopyExtensionValue(sc, '1.1.1', b), null);
});
