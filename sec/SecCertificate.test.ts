import { Uint8Ptr } from '@hqtsm/struct';
import { assertEquals, assertInstanceOf } from '@std/assert';
import { INT32_MAX, INT32_MIN, UINT32_MAX } from '../libc/stdint.ts';
import {
	ASN1_BIT_STRING,
	ASN1_BMP_STRING,
	ASN1_GENERAL_STRING,
	ASN1_IA5_STRING,
	ASN1_OCTET_STRING,
	ASN1_PRINTABLE_STRING,
	ASN1_T61_STRING,
	ASN1_UNIVERSAL_STRING,
	ASN1_UTF8_STRING,
	ASN1_VIDEOTEX_STRING,
	ASN1_VISIBLE_STRING,
	ONE_BYTE_ASN1_CONSTR_SEQUENCE,
	ONE_BYTE_ASN1_CONSTR_SET,
} from '../libDER/asn1Types.ts';
import { DERItem } from '../libDER/DERItem.ts';
import { errSecSuccess } from '../Security/SecBase.ts';
import { errSecInvalidCertificate } from '../Security/SecBasePriv.ts';
import { digest } from '../spec/hash.ts';
import { unhex } from '../spec/hex.ts';
import {
	__SecCertificate,
	copyAttributeValueFromX501Name,
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

/**
 * ATV context.
 */
interface ATV_Context {
	/**
	 * Attribute OID.
	 */
	attributeOID: DERItem;

	/**
	 * Result.
	 */
	result: string | null;
}

const ABCD = new Uint8Array([...'ABCD'].map((c) => c.charCodeAt(0)));
const ABCD0 = new Uint8Array([...'ABCD\0'].map((c) => c.charCodeAt(0)));
const itemABCD = new DERItem(new Uint8Ptr(ABCD.buffer), ABCD.byteLength);

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

Deno.test('copyAttributeValueFromX501Name', () => {
	const context: ATV_Context = {
		attributeOID: itemABCD,
		result: null,
	};

	assertEquals(
		copyAttributeValueFromX501Name(
			context,
			itemABCD,
			new DERItem(new Uint8Ptr(new ArrayBuffer(1)), 1),
			0,
			false,
		),
		errSecInvalidCertificate,
	);
});

Deno.test('copyAttributeValueFromX501Name: bool', () => {
	const context: ATV_Context = {
		attributeOID: itemABCD,
		result: null,
	};

	assertEquals(
		copyAttributeValueFromX501Name(
			context,
			itemABCD,
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
			itemABCD,
			new DERItem(new Uint8Ptr(unhex('01 01 00').buffer), 3),
			0,
			false,
		),
		errSecSuccess,
	);
	assertEquals(context.result, '0');
});

Deno.test('copyAttributeValueFromX501Name: int', () => {
	const context: ATV_Context = {
		attributeOID: itemABCD,
		result: null,
	};

	assertEquals(
		copyAttributeValueFromX501Name(
			context,
			itemABCD,
			new DERItem(new Uint8Ptr(unhex('02 01 00').buffer), 3),
			0,
			false,
		),
		errSecSuccess,
	);
	assertEquals(context.result, '0');

	assertEquals(
		copyAttributeValueFromX501Name(
			context,
			itemABCD,
			new DERItem(
				new Uint8Ptr(unhex('02 09 12 34 56 78 9A BC DE F0 0F').buffer),
				11,
			),
			0,
			false,
		),
		errSecSuccess,
	);
	assertEquals(context.result, '12 34 56 78 9A BC DE F0 0F');

	assertEquals(
		copyAttributeValueFromX501Name(
			context,
			itemABCD,
			new DERItem(
				new Uint8Ptr(unhex('02 04 41 42 43 44').buffer),
				6,
			),
			0,
			false,
		),
		errSecSuccess,
	);
	assertEquals(context.result, (0x41424344).toString());
});

Deno.test('copyAttributeValueFromX501Name: ASCII', () => {
	const context: ATV_Context = {
		attributeOID: itemABCD,
		result: null,
	};

	for (const tag of [ASN1_PRINTABLE_STRING, ASN1_IA5_STRING]) {
		const b = new Uint8Array(ABCD.byteLength + 2);
		b[0] = Number(tag);
		b[1] = ABCD.byteLength;
		b.set(ABCD, 2);
		context.result = '?';
		assertEquals(
			copyAttributeValueFromX501Name(
				context,
				itemABCD,
				new DERItem(new Uint8Ptr(b.buffer), b.byteLength),
				0,
				false,
			),
			errSecSuccess,
		);
		assertEquals(context.result, 'ABCD', String(tag));
	}

	context.result = null;
	assertEquals(
		copyAttributeValueFromX501Name(
			context,
			itemABCD,
			new DERItem(
				new Uint8Ptr(
					new Uint8Array([19, ABCD0.byteLength, ...ABCD0]).buffer,
				),
				2 + ABCD0.byteLength,
			),
			0,
			false,
		),
		errSecSuccess,
	);
	assertEquals(context.result, 'ABCD');

	assertEquals(
		copyAttributeValueFromX501Name(
			context,
			itemABCD,
			new DERItem(
				new Uint8Ptr(new Uint8Array([19, 2, 0xFF, 0xEE]).buffer),
				4,
			),
			0,
			false,
		),
		errSecSuccess,
	);
	assertEquals(context.result, 'FF EE');
});

Deno.test('copyAttributeValueFromX501Name: ASCII over', () => {
	const context: ATV_Context = {
		attributeOID: itemABCD,
		result: null,
	};
	const data = unhex('13 84 80 00 00 00');

	// Fake reading from a huge buffer.
	const desc = Object.getOwnPropertyDescriptor(
		Uint8Ptr.prototype,
		'get',
	)!;
	Object.defineProperty(Uint8Ptr.prototype, 'get', {
		...desc,
		value: function get(
			this: Uint8Ptr,
			index: number,
		): number {
			if (index >= data.byteLength) {
				return 1;
			}
			return Reflect.apply(desc.value, this, arguments);
		},
	})!;

	try {
		assertEquals(
			copyAttributeValueFromX501Name(
				context,
				itemABCD,
				new DERItem(
					new Uint8Ptr(data.buffer),
					data.byteLength + INT32_MAX + 1,
				),
				0,
				false,
			),
			errSecInvalidCertificate,
		);
	} finally {
		Object.defineProperty(Uint8Ptr.prototype, 'get', desc);
	}
});

Deno.test('copyAttributeValueFromX501Name: UTF-8', () => {
	const context: ATV_Context = {
		attributeOID: itemABCD,
		result: null,
	};
	const data = new Uint8Array([0, 2, 0xC2, 0xA9]);
	for (
		const tag of [
			ASN1_UTF8_STRING,
			ASN1_GENERAL_STRING,
			ASN1_UNIVERSAL_STRING,
		]
	) {
		data[0] = Number(tag);
		context.result = null;
		assertEquals(
			copyAttributeValueFromX501Name(
				context,
				itemABCD,
				new DERItem(new Uint8Ptr(data.buffer), data.byteLength),
				0,
				false,
			),
			errSecSuccess,
			String(tag),
		);
		// deno-lint-ignore prefer-ascii
		assertEquals(context.result, '©', String(tag));
	}
});

Deno.test('copyAttributeValueFromX501Name: Latin-1', () => {
	const context: ATV_Context = {
		attributeOID: itemABCD,
		result: null,
	};
	const data = new Uint8Array([0, 1, 0xFF]);
	for (
		const tag of [
			ASN1_T61_STRING,
			ASN1_VIDEOTEX_STRING,
			ASN1_VISIBLE_STRING,
		]
	) {
		data[0] = Number(tag);
		context.result = null;
		assertEquals(
			copyAttributeValueFromX501Name(
				context,
				itemABCD,
				new DERItem(new Uint8Ptr(data.buffer), data.byteLength),
				0,
				false,
			),
			errSecSuccess,
			String(tag),
		);
		assertEquals(context.result, '\xFF', String(tag));
	}
});

Deno.test('copyAttributeValueFromX501Name: UTF-16', () => {
	const context: ATV_Context = {
		attributeOID: itemABCD,
		result: null,
	};
	{
		const data = new DataView(new ArrayBuffer(4));
		data.setUint8(0, Number(ASN1_BMP_STRING));
		data.setUint8(1, 2);
		data.setUint16(2, 0xFF);
		assertEquals(
			copyAttributeValueFromX501Name(
				context,
				itemABCD,
				new DERItem(new Uint8Ptr(data.buffer), data.byteLength),
				0,
				false,
			),
			errSecSuccess,
		);
		assertEquals(context.result, '\xFF');
	}
	{
		const data = new DataView(new ArrayBuffer(5));
		data.setUint8(0, Number(ASN1_BMP_STRING));
		data.setUint8(1, 3);
		data.setUint16(2, 0x12);
		data.setUint8(4, 0x34);
		assertEquals(
			copyAttributeValueFromX501Name(
				context,
				itemABCD,
				new DERItem(new Uint8Ptr(data.buffer), data.byteLength),
				0,
				false,
			),
			errSecSuccess,
		);
		assertEquals(context.result, '00 12 34');
	}
});

Deno.test('copyAttributeValueFromX501Name: blob strings', () => {
	const context: ATV_Context = {
		attributeOID: itemABCD,
		result: null,
	};
	const data = new Uint8Array([0, 4, ...ABCD]);

	data[0] = Number(ASN1_OCTET_STRING);
	assertEquals(
		copyAttributeValueFromX501Name(
			context,
			itemABCD,
			new DERItem(new Uint8Ptr(data.buffer), data.byteLength),
			0,
			false,
		),
		errSecSuccess,
	);
	assertEquals(context.result, 'Byte string; 4 bytes; data = 41 42 43 44');

	data[0] = Number(ASN1_BIT_STRING);
	assertEquals(
		copyAttributeValueFromX501Name(
			context,
			itemABCD,
			new DERItem(new Uint8Ptr(data.buffer), data.byteLength),
			0,
			false,
		),
		errSecSuccess,
	);
	assertEquals(context.result, 'Bit string; 4 bits; data = 41 42 43 44');

	data[0] = Number(ONE_BYTE_ASN1_CONSTR_SEQUENCE);
	assertEquals(
		copyAttributeValueFromX501Name(
			context,
			itemABCD,
			new DERItem(new Uint8Ptr(data.buffer), data.byteLength),
			0,
			false,
		),
		errSecSuccess,
	);
	assertEquals(context.result, 'Sequence; 4 bytes; data = 41 42 43 44');

	data[0] = Number(ONE_BYTE_ASN1_CONSTR_SET);
	assertEquals(
		copyAttributeValueFromX501Name(
			context,
			itemABCD,
			new DERItem(new Uint8Ptr(data.buffer), data.byteLength),
			0,
			false,
		),
		errSecSuccess,
	);
	assertEquals(context.result, 'Set; 4 bytes; data = 41 42 43 44');
});

Deno.test('copyAttributeValueFromX501Name: blob strings over', () => {
	const context: ATV_Context = {
		attributeOID: itemABCD,
		result: null,
	};
	const data = unhex('04 84 7F FF FF FF');

	assertEquals(
		copyAttributeValueFromX501Name(
			context,
			itemABCD,
			new DERItem(new Uint8Ptr(data.buffer), data.byteLength + INT32_MAX),
			0,
			false,
		),
		errSecSuccess,
	);
	assertEquals(
		context.result,
		`Byte string; ${INT32_MAX} bytes; data = (null)`,
	);
});

Deno.test('copyAttributeValueFromX501Name: OID', () => {
	const context: ATV_Context = {
		attributeOID: itemABCD,
		result: null,
	};

	assertEquals(
		copyAttributeValueFromX501Name(
			context,
			itemABCD,
			new DERItem(new Uint8Ptr(unhex('06 00').buffer), 2),
			0,
			false,
		),
		errSecSuccess,
	);
	assertEquals(context.result, SEC_NULL_KEY);

	assertEquals(
		copyAttributeValueFromX501Name(
			context,
			itemABCD,
			new DERItem(new Uint8Ptr(unhex('06 03 2A 03 04').buffer), 5),
			0,
			false,
		),
		errSecSuccess,
	);
	assertEquals(context.result, '1.2.3.4');
});

Deno.test('copyAttributeValueFromX501Name: not displayed', () => {
	const context: ATV_Context = {
		attributeOID: itemABCD,
		result: null,
	};

	assertEquals(
		copyAttributeValueFromX501Name(
			context,
			itemABCD,
			new DERItem(new Uint8Ptr(unhex('00 02 01 02').buffer), 4),
			0,
			false,
		),
		errSecSuccess,
	);
	assertEquals(context.result, 'not displayed (tag = 0; length 2)');
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
