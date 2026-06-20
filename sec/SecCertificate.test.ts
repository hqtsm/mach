import { Uint8Ptr } from '@hqtsm/struct';
import { assertEquals, assertInstanceOf } from '@std/assert';
import { INT32_MAX, INT32_MIN, UINT32_MAX } from '../libc/stdint.ts';
import {
	ASN1_BIT_STRING,
	ASN1_BMP_STRING,
	ASN1_CONSTR_SEQUENCE,
	ASN1_CONSTR_SET,
	ASN1_GENERAL_STRING,
	ASN1_IA5_STRING,
	ASN1_INTEGER,
	ASN1_OBJECT_ID,
	ASN1_OCTET_STRING,
	ASN1_PRINTABLE_STRING,
	ASN1_T61_STRING,
	ASN1_UNIVERSAL_STRING,
	ASN1_UTF8_STRING,
	ASN1_VIDEOTEX_STRING,
	ASN1_VISIBLE_STRING,
} from '../libDER/asn1Types.ts';
import { DERItem } from '../libDER/DERItem.ts';
import { digest } from '../spec/hash.ts';
import { unhex } from '../spec/hex.ts';
import {
	__SecCertificate,
	copyDERThingContentDescription,
	copyDERThingDescription,
	GetDecimalValueOfString,
	SecCertificateCopyExtensionValue,
	SecCertificateCopyIssuerSHA256Digest,
	SecCertificateCopySHA1Digest,
	SecCertificateCreateOidDataFromString,
	SecCertificateExtension,
	SecCertificateIsOidString,
	SecDERItemCopyOIDDecimalRepresentation,
} from './SecCertificate.ts';
import { SEC_NULL_KEY, SEC_OID_TOO_LONG_KEY } from './SecFrameworkStrings.ts';

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

Deno.test('copyDERThingDescription', () => {
	assertEquals(
		copyDERThingDescription(
			new DERItem(new Uint8Ptr(new ArrayBuffer(1)), 1),
			true,
			false,
		),
		null,
	);
	assertEquals(
		copyDERThingDescription(
			new DERItem(new Uint8Ptr(new ArrayBuffer(1)), 1),
			false,
			false,
		),
		'00',
	);
});

Deno.test('copyDERThingContentDescription: int bool', () => {
	assertEquals(
		copyDERThingDescription(
			new DERItem(new Uint8Ptr(unhex('01 00').buffer), 2),
			false,
			false,
		),
		'',
	);
	assertEquals(
		copyDERThingDescription(
			new DERItem(new Uint8Ptr(unhex('01 01 00').buffer), 3),
			false,
			false,
		),
		'0',
	);
	assertEquals(
		copyDERThingDescription(
			new DERItem(new Uint8Ptr(unhex('02 01 00').buffer), 3),
			false,
			false,
		),
		'0',
	);
	assertEquals(
		copyDERThingDescription(
			new DERItem(
				new Uint8Ptr(unhex('02 09 12 34 56 78 9A BC DE F0 0F').buffer),
				11,
			),
			false,
			false,
		),
		'12 34 56 78 9A BC DE F0 0F',
	);
	assertEquals(
		copyDERThingDescription(
			new DERItem(
				new Uint8Ptr(unhex('02 04 41 42 43 44').buffer),
				6,
			),
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

Deno.test('copyDERThingContentDescription: ASCII', () => {
	for (const tag of [ASN1_PRINTABLE_STRING, ASN1_IA5_STRING]) {
		const b = new Uint8Array(ABCD.byteLength + 2);
		b[0] = Number(tag);
		b[1] = ABCD.byteLength;
		b.set(ABCD, 2);
		assertEquals(
			copyDERThingDescription(
				new DERItem(new Uint8Ptr(b.buffer), b.byteLength),
				false,
				false,
			),
			'ABCD',
			String(tag),
		);
	}
	assertEquals(
		copyDERThingDescription(
			new DERItem(
				new Uint8Ptr(
					new Uint8Array([19, ABCD0.byteLength, ...ABCD0]).buffer,
				),
				2 + ABCD0.byteLength,
			),
			false,
			false,
		),
		'ABCD',
	);
	assertEquals(
		copyDERThingContentDescription(
			ASN1_PRINTABLE_STRING,
			new DERItem(new Uint8Ptr(new ArrayBuffer()), 0),
			true,
			false,
		),
		null,
	);
	assertEquals(
		copyDERThingContentDescription(
			ASN1_PRINTABLE_STRING,
			new DERItem(new Uint8Ptr(new Uint8Array([0xFF, 0xEE]).buffer), 2),
			true,
			false,
		),
		null,
	);
	assertEquals(
		copyDERThingDescription(
			new DERItem(
				new Uint8Ptr(new Uint8Array([19, 2, 0xFF, 0xEE]).buffer),
				4,
			),
			false,
			false,
		),
		'FF EE',
	);
	assertEquals(
		copyDERThingContentDescription(
			ASN1_PRINTABLE_STRING,
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
			false,
			false,
		),
		null,
	);
});

Deno.test('copyDERThingContentDescription: UTF-8', () => {
	for (
		const tag of [
			ASN1_UTF8_STRING,
			ASN1_GENERAL_STRING,
			ASN1_UNIVERSAL_STRING,
		]
	) {
		assertEquals(
			copyDERThingContentDescription(
				tag,
				new DERItem(
					new Uint8Ptr(new Uint8Array([0xC2, 0xA9]).buffer),
					2,
				),
				false,
				false,
			),
			// deno-lint-ignore prefer-ascii
			'©',
			String(tag),
		);
	}
});

Deno.test('copyDERThingContentDescription: Latin-1', () => {
	for (
		const tag of [
			ASN1_T61_STRING,
			ASN1_VIDEOTEX_STRING,
			ASN1_VISIBLE_STRING,
		]
	) {
		assertEquals(
			copyDERThingContentDescription(
				tag,
				new DERItem(
					new Uint8Ptr(new Uint8Array([0xFF, 0xA9]).buffer),
					1,
				),
				false,
				false,
			),
			'\xFF',
			String(tag),
		);
	}
});

Deno.test('copyDERThingContentDescription: UTF-16', () => {
	const data = new DataView(new ArrayBuffer(2));
	data.setUint16(0, 0xFF);
	assertEquals(
		copyDERThingContentDescription(
			ASN1_BMP_STRING,
			new DERItem(
				new Uint8Ptr(data.buffer),
				2,
			),
			false,
			false,
		),
		'\xFF',
	);
	assertEquals(
		copyDERThingContentDescription(
			ASN1_BMP_STRING,
			new DERItem(
				new Uint8Ptr(new Uint8Array([0x12, 0x00, 0x34]).buffer),
				3,
			),
			false,
			false,
		),
		'12 00 34',
	);
});

Deno.test('copyDERThingContentDescription: blob strings', () => {
	const blob = new DERItem(new Uint8Ptr(ABCD.buffer), ABCD.byteLength);
	assertEquals(
		copyDERThingContentDescription(ASN1_OCTET_STRING, blob, false, false),
		'Byte string; 4 bytes; data = 41 42 43 44',
	);
	assertEquals(
		copyDERThingContentDescription(ASN1_BIT_STRING, blob, false, false),
		'Bit string; 4 bits; data = 41 42 43 44',
	);
	assertEquals(
		copyDERThingContentDescription(
			ASN1_CONSTR_SEQUENCE,
			blob,
			false,
			false,
		),
		'Sequence; 4 bytes; data = 41 42 43 44',
	);
	assertEquals(
		copyDERThingContentDescription(ASN1_CONSTR_SET, blob, false, false),
		'Set; 4 bytes; data = 41 42 43 44',
	);
	assertEquals(
		copyDERThingContentDescription(
			ASN1_OCTET_STRING,
			new DERItem(new Uint8Ptr(new ArrayBuffer()), INT32_MAX),
			false,
			true,
		),
		`Byte string; ${INT32_MAX} bytes; data = (null)`,
	);
});

Deno.test('copyDERThingContentDescription: OID', () => {
	assertEquals(
		copyDERThingContentDescription(
			ASN1_OBJECT_ID,
			new DERItem(new Uint8Ptr(new ArrayBuffer()), 0),
			false,
			false,
		),
		SEC_NULL_KEY,
	);
	assertEquals(
		copyDERThingContentDescription(
			ASN1_OBJECT_ID,
			new DERItem(new Uint8Ptr(new ArrayBuffer()), 0),
			false,
			true,
		),
		SEC_NULL_KEY,
	);
	assertEquals(
		copyDERThingContentDescription(
			ASN1_OBJECT_ID,
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
			false,
		),
		'1.2.3.4',
	);
});

Deno.test('copyDERThingContentDescription: not displayed', () => {
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
	for (
		const tag of [
			ASN1_OCTET_STRING,
			ASN1_BIT_STRING,
			ASN1_CONSTR_SEQUENCE,
			ASN1_CONSTR_SET,
			ASN1_OBJECT_ID,
		]
	) {
		assertEquals(
			copyDERThingContentDescription(
				tag,
				new DERItem(new Uint8Ptr(new ArrayBuffer()), 42),
				true,
				false,
			),
			null,
		);
	}
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
