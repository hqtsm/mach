import { Uint8Ptr } from '@hqtsm/struct';
import {
	assertEquals,
	assertInstanceOf,
	assertStrictEquals,
} from '@std/assert';
import { kCFStringEncodingASCII } from '../CoreFoundation/mod.ts';
import { INT32_MAX, INT32_MIN, UINT32_MAX } from '../libc/mod.ts';
import {
	ASN1_BIT_STRING,
	ASN1_BMP_STRING,
	ASN1_BOOLEAN,
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
	DERItem,
} from '../libDER/mod.ts';
import { digest, unhex } from '../spec/mod.ts';
import { errSecDecode, errSecSuccess, errSecUserCanceled } from './SecBase.ts';
import { errSecInvalidCertificate } from './SecBasePriv.ts';
import {
	__SecCertificate,
	type ATV_Context,
	copyAttributeValueFromX501Name,
	copyBlobString,
	copyContentString,
	copyDERThingContentDescription,
	copyDERThingDescription,
	copyHexDescription,
	copyIntegerContentDescription,
	copyOidDescription,
	GetDecimalValueOfString,
	parseRDNContent,
	parseX501NameContent,
	SecCertificateCopyExtensionValue,
	SecCertificateCopyIssuerSHA256Digest,
	SecCertificateCopySHA1Digest,
	SecCertificateCopySubjectAttributeValue,
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

const ABCD = new Uint8Array([...'ABCD'].map((c) => c.charCodeAt(0)));
const ABCD0 = new Uint8Array([...'ABCD\0'].map((c) => c.charCodeAt(0)));

Deno.test('parseRDNContent: values', () => {
	const data = unhex([
		'30 0C 06 03 55 04 03 13 05 48 65 6C 6C 6F',
		'30 0C 06 03 56 05 06 13 05 57 6F 72 6C 64',
	].join(' '));
	const item = new DERItem(new Uint8Ptr(data.buffer), data.byteLength);
	const ctx = { test: 123 };
	const status = parseRDNContent(
		item,
		ctx,
		(context, type, value, rdnIX, localized) => {
			assertStrictEquals(context, ctx);
			assertEquals(localized, false);
			const offset = rdnIX ? 14 : 0;
			assertEquals(rdnIX, rdnIX ? 1 : 0);
			assertEquals(type.length, 3);
			assertEquals(type.data![0], data[offset + 4]);
			assertEquals(type.data![1], data[offset + 5]);
			assertEquals(type.data![2], data[offset + 6]);
			assertEquals(value.length, 7);
			assertEquals(value.data![0], data[offset + 7]);
			assertEquals(value.data![1], data[offset + 8]);
			assertEquals(value.data![2], data[offset + 9]);
			assertEquals(value.data![3], data[offset + 10]);
			assertEquals(value.data![4], data[offset + 11]);
			assertEquals(value.data![5], data[offset + 12]);
			assertEquals(value.data![6], data[offset + 13]);
			return errSecSuccess;
		},
		false,
	);
	assertEquals(status, errSecSuccess);
});

Deno.test('parseRDNContent: extra', () => {
	const data = unhex('30 0C 06 03 55 04 03 13 05 48 65 6C 6C 6F 00');
	const item = new DERItem(new Uint8Ptr(data.buffer), data.byteLength);
	const status = parseRDNContent(
		item,
		null,
		() => errSecSuccess,
		false,
	);
	assertEquals(status, errSecInvalidCertificate);
});
Deno.test('parseRDNContent: cancel', () => {
	const data = unhex([
		'30 0C 06 03 55 04 03 13 05 48 65 6C 6C 6F',
		'00',
	].join(' '));
	const item = new DERItem(new Uint8Ptr(data.buffer), data.byteLength);
	const status = parseRDNContent(
		item,
		null,
		(_context, _type, _value, rdnIX, localized) => {
			assertEquals(rdnIX, 0);
			assertEquals(localized, true);
			return errSecUserCanceled;
		},
		true,
	);
	assertEquals(status, errSecUserCanceled);
});

Deno.test('parseRDNContent: not sequence', () => {
	const data = unhex('06 03 55 04 03');
	const item = new DERItem(new Uint8Ptr(data.buffer), data.byteLength);
	const status = parseRDNContent(
		item,
		null,
		() => errSecSuccess,
		false,
	);
	assertEquals(status, errSecInvalidCertificate);
});

Deno.test('parseRDNContent: bad sequence', () => {
	const data = unhex('30 02 05 00');
	const item = new DERItem(new Uint8Ptr(data.buffer), data.byteLength);
	const status = parseRDNContent(
		item,
		null,
		() => errSecSuccess,
		false,
	);
	assertEquals(status, errSecInvalidCertificate);
});

Deno.test('parseRDNContent: empty oid', () => {
	const data = unhex('30 04 06 00 05 00');
	const item = new DERItem(new Uint8Ptr(data.buffer), data.byteLength);
	const status = parseRDNContent(
		item,
		null,
		() => errSecSuccess,
		false,
	);
	assertEquals(status, errSecInvalidCertificate);
});

Deno.test('parseX501NameContent: values', () => {
	const data = unhex([
		'31 0E 30 0C 06 03 55 04 03 13 05 41 6C 69 63 65',
		'31 0B 30 09 06 03 55 04 06 13 02 55 53',
	].join(' '));
	const item = new DERItem(new Uint8Ptr(data.buffer), data.byteLength);
	const ctx = { i: 0 };
	const status = parseX501NameContent(
		item,
		ctx,
		(context, type, value, rdnIX, localized) => {
			assertStrictEquals(context, ctx);
			assertEquals(localized, false);
			assertEquals(rdnIX, rdnIX ? 1 : 0);
			assertEquals(type.length, 3);
			assertEquals(value.length, ctx.i ? 4 : 7);
			ctx.i++;
			return errSecSuccess;
		},
		false,
	);
	assertEquals(status, errSecSuccess);
});

Deno.test('parseX501NameContent: bad tag', () => {
	const data = unhex('30 00 02 01 00 06 00');
	const item = new DERItem(new Uint8Ptr(data.buffer), data.byteLength);
	const status = parseX501NameContent(
		item,
		null,
		() => errSecSuccess,
		false,
	);
	assertEquals(status, errSecDecode);
});

Deno.test('parseX501NameContent: bad length', () => {
	const data = unhex('31 00');
	const item = new DERItem(new Uint8Ptr(data.buffer), data.byteLength);
	const status = parseX501NameContent(
		item,
		null,
		() => errSecSuccess,
		false,
	);
	assertEquals(status, errSecDecode);
});

Deno.test('parseX501NameContent: cancel', () => {
	const data = unhex([
		'31 0E 30 0C 06 03 55 04 03 13 05 41 6C 69 63 65',
		'00',
	].join(' '));
	const item = new DERItem(new Uint8Ptr(data.buffer), data.byteLength);
	const status = parseX501NameContent(
		item,
		null,
		(_context, _type, _value, _rdnIX, localized) => {
			assertEquals(localized, true);
			return errSecUserCanceled;
		},
		true,
	);
	assertEquals(status, errSecUserCanceled);
});

Deno.test('parseX501NameContent: extra', () => {
	const data = unhex([
		'31 0E 30 0C 06 03 55 04 03 13 05 41 6C 69 63 65',
		'00',
	].join(' '));
	const item = new DERItem(new Uint8Ptr(data.buffer), data.byteLength);
	const status = parseX501NameContent(
		item,
		null,
		() => errSecSuccess,
		true,
	);
	assertEquals(status, errSecInvalidCertificate);
});

Deno.test('parseX501NameContent: over limit', () => {
	const data = unhex(
		new Array(1025)
			.fill('31 0E 30 0C 06 03 55 04 03 13 05 41 6C 69 63 65')
			.join(' '),
	);
	const item = new DERItem(new Uint8Ptr(data.buffer), data.byteLength);
	const status = parseX501NameContent(
		item,
		null,
		() => errSecSuccess,
		true,
	);
	assertEquals(status, errSecInvalidCertificate);
});

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
	assertEquals(
		copyHexDescription(
			new DERItem(new Uint8Ptr(ABCD.buffer), ABCD.byteLength),
		),
		'41 42 43 44',
	);

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

Deno.test('copyIntegerContentDescription', () => {
	assertEquals(
		copyIntegerContentDescription(
			new DERItem(),
		),
		'',
	);
	assertEquals(
		copyIntegerContentDescription(
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
		),
		'12 34 56 78 9A BC DE F0 0F',
	);
	assertEquals(
		copyIntegerContentDescription(
			new DERItem(new Uint8Ptr(ABCD.buffer), ABCD.byteLength),
		),
		(0x41424344).toString(),
	);
});

Deno.test('copyDERThingContentDescription: bool', () => {
	assertEquals(
		copyDERThingContentDescription(
			ASN1_BOOLEAN,
			new DERItem(),
			false,
			false,
		),
		'',
	);
});

Deno.test('copyDERThingContentDescription: int', () => {
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

Deno.test('copyDERThingContentDescription: ASCII', () => {
	for (const tag of [ASN1_PRINTABLE_STRING, ASN1_IA5_STRING]) {
		assertEquals(
			copyDERThingContentDescription(
				tag,
				new DERItem(new Uint8Ptr(ABCD.buffer), ABCD.byteLength),
				false,
				false,
			),
			'ABCD',
			String(tag),
		);
	}
	assertEquals(
		copyDERThingContentDescription(
			ASN1_PRINTABLE_STRING,
			new DERItem(new Uint8Ptr(ABCD0.buffer), ABCD0.byteLength),
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
		copyDERThingContentDescription(
			ASN1_PRINTABLE_STRING,
			new DERItem(new Uint8Ptr(new Uint8Array([0xFF, 0xEE]).buffer), 2),
			false,
			false,
		),
		'FF EE',
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
			String(tag),
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

Deno.test('copyAttributeValueFromX501Name', () => {
	const item = new DERItem(new Uint8Ptr(ABCD.buffer), ABCD.byteLength);
	const context: ATV_Context = {
		attributeOID: item,
		result: null,
	};

	assertEquals(
		copyAttributeValueFromX501Name(
			context,
			item,
			new DERItem(new Uint8Ptr(new ArrayBuffer(1)), 1),
			0,
			false,
		),
		errSecInvalidCertificate,
	);

	assertEquals(
		copyAttributeValueFromX501Name(
			context,
			item,
			new DERItem(new Uint8Ptr(unhex('01 00').buffer), 2),
			0,
			false,
		),
		errSecSuccess,
	);
	assertEquals(context.result, '');

	assertEquals(
		copyAttributeValueFromX501Name(
			context,
			item,
			new DERItem(new Uint8Ptr(unhex('01 01 00').buffer), 3),
			0,
			false,
		),
		errSecSuccess,
	);
	assertEquals(context.result, '0');
});

Deno.test('SecCertificateCopySubjectAttributeValue', () => {
	const cert = new __SecCertificate();
	const oid = unhex('55 04 03');
	{
		const data = unhex('31 0E 30 0C 06 03 55 04 03 13 05 41 6C 69 63 65');
		cert._subject = new DERItem(new Uint8Ptr(data.buffer), data.byteLength);
	}
	assertEquals(
		SecCertificateCopySubjectAttributeValue(
			cert,
			new DERItem(new Uint8Ptr(oid.buffer), oid.byteLength),
		),
		'Alice',
	);
	{
		const data = unhex('31 0E 30 0C 06 03 55 04 03');
		cert._subject = new DERItem(new Uint8Ptr(data.buffer), data.byteLength);
	}
	assertEquals(
		SecCertificateCopySubjectAttributeValue(
			cert,
			new DERItem(new Uint8Ptr(oid.buffer), oid.byteLength),
		),
		null,
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
