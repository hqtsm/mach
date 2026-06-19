/**
 * ASN.1 boolean.
 */
export const ASN1_BOOLEAN = 0x01n;

/**
 * ASN.1 integer.
 */
export const ASN1_INTEGER = 0x02n;

/**
 * ASN.1 bit string.
 */
export const ASN1_BIT_STRING = 0x03n;

/**
 * ASN.1 octet string.
 */
export const ASN1_OCTET_STRING = 0x04n;

/**
 * ASN.1 null.
 */
export const ASN1_NULL = 0x05n;

/**
 * ASN.1 object identifier.
 */
export const ASN1_OBJECT_ID = 0x06n;

/**
 * ASN.1 object descriptor.
 */
export const ASN1_OBJECT_DESCRIPTOR = 0x07n;

/**
 * ASN.1 real.
 */
export const ASN1_REAL = 0x09n;

/**
 * ASN.1 enumerated.
 */
export const ASN1_ENUMERATED = 0x0an;

/**
 * ASN.1 embedded PDV.
 */
export const ASN1_EMBEDDED_PDV = 0x0bn;

/**
 * ASN.1 UTF-8 string.
 */
export const ASN1_UTF8_STRING = 0x0cn;

/**
 * ASN.1 sequence.
 */
export const ASN1_SEQUENCE = 0x10n;

/**
 * ASN.1 set.
 */
export const ASN1_SET = 0x11n;

/**
 * ASN.1 numeric string.
 */
export const ASN1_NUMERIC_STRING = 0x12n;

/**
 * ASN.1 printable string.
 */
export const ASN1_PRINTABLE_STRING = 0x13n;

/**
 * ASN.1 T61 string.
 */
export const ASN1_T61_STRING = 0x14n;

/**
 * ASN.1 videotex string.
 */
export const ASN1_VIDEOTEX_STRING = 0x15n;

/**
 * ASN.1 IA5 string.
 */
export const ASN1_IA5_STRING = 0x16n;

/**
 * ASN.1 UTC time.
 */
export const ASN1_UTC_TIME = 0x17n;

/**
 * ASN.1 generalized time.
 */
export const ASN1_GENERALIZED_TIME = 0x18n;

/**
 * ASN.1 graphic string.
 */
export const ASN1_GRAPHIC_STRING = 0x19n;

/**
 * ASN.1 visible string.
 */
export const ASN1_VISIBLE_STRING = 0x1an;

/**
 * ASN.1 general string.
 */
export const ASN1_GENERAL_STRING = 0x1bn;

/**
 * ASN.1 universal string.
 */
export const ASN1_UNIVERSAL_STRING = 0x1cn;

/**
 * ASN.1 character string.
 */
export const ASN1_BMP_STRING = 0x1en;

/**
 * ASN.1 high tag number.
 */
export const ASN1_HIGH_TAG_NUMBER = 0x1fn;

/**
 * ASN.1 teletex string.
 */
export const ASN1_TELETEX_STRING = ASN1_T61_STRING;

/**
 * ASN.1 tag mask.
 */
export const ASN1_TAG_MASK = 0xffffffffffffffffn;

/**
 * ASN.1 tag number mask.
 */
export const ASN1_TAGNUM_MASK = 0x1fffffffffffffffn;

/**
 * ASN.1 method mask.
 */
export const ASN1_METHOD_MASK = 0x2000000000000000n;

/**
 * ASN.1 primitive.
 */
export const ASN1_PRIMITIVE = 0x0n;

/**
 * ASN.1 constructed.
 */
export const ASN1_CONSTRUCTED = 0x2000000000000000n;

/**
 * ASN.1 class mask.
 */
export const ASN1_CLASS_MASK = 0xc000000000000000n;

/**
 * ASN.1 universal.
 */
export const ASN1_UNIVERSAL = 0x0n;

/**
 * ASN.1 application.
 */
export const ASN1_APPLICATION = 0x4000000000000000n;

/**
 * ASN.1 context specific.
 */
export const ASN1_CONTEXT_SPECIFIC = 0x8000000000000000n;

/**
 * ASN.1 private.
 */
export const ASN1_PRIVATE = 0xc000000000000000n;

/**
 * 1-byte ASN.1 tag mask.
 */
export const ONE_BYTE_ASN1_TAG_MASK = 0xffn;

/**
 * 1-byte ASN.1 tag number mask.
 */
export const ONE_BYTE_ASN1_TAGNUM_MASK = 0x1fn;

/**
 * 1-byte ASN.1 method mask.
 */
export const ONE_BYTE_ASN1_METHOD_MASK = 0x20n;

/**
 * 1-byte ASN.1 primitive.
 */
export const ONE_BYTE_ASN1_PRIMITIVE = 0x00n;

/**
 * 1-byte ASN.1 constructed.
 */
export const ONE_BYTE_ASN1_CONSTRUCTED = 0x20n;

/**
 * 1-byte ASN.1 class mask.
 */
export const ONE_BYTE_ASN1_CLASS_MASK = 0xc0n;

/**
 * 1-byte ASN.1 universal.
 */
export const ONE_BYTE_ASN1_UNIVERSAL = 0x00n;

/**
 * 1-byte ASN.1 application.
 */
export const ONE_BYTE_ASN1_APPLICATION = 0x40n;

/**
 * 1-byte ASN.1 context specific.
 */
export const ONE_BYTE_ASN1_CONTEXT_SPECIFIC = 0x80n;

/**
 * 1-byte ASN.1 private.
 */
export const ONE_BYTE_ASN1_PRIVATE = 0xc0n;

/**
 * ASN.1 constructed sequence.
 *
 * `ASN1_CONSTRUCTED | ASN1_SEQUENCE`
 */
export const ASN1_CONSTR_SEQUENCE = 0x2000000000000010n;

/**
 * ASN.1 constructed set.
 *
 * `ASN1_CONSTRUCTED | ASN1_SET`
 */
export const ASN1_CONSTR_SET = 0x2000000000000011n;

/**
 * 1-byte ASN.1 constructed sequence.
 */
export const ONE_BYTE_ASN1_CONSTR_SEQUENCE = 0x30n;

/**
 * 1-byte ASN.1 constructed set.
 */
export const ONE_BYTE_ASN1_CONSTR_SET = 0x31n;
