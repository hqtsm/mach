import {
	type bool,
	type int32_t,
	type int64_t,
	memcmp,
	memset,
	type size_t,
	type uint16_t,
	type uint32_t,
	type uint64_t,
	type uint8_t,
} from '../libc/mod.ts';

/**
 * DER byte.
 */
export type DERByte = uint8_t;

/**
 * DER short.
 */
export type DERShort = uint16_t;

/**
 * DER int.
 */
export type DERInt = uint32_t;

/**
 * DER signed int.
 */
export type DERSignedInt = int32_t;

/**
 * DER long.
 */
export type DERLong = uint64_t;

/**
 * DER signed long.
 */
export type DERSignedLong = int64_t;

/**
 * DER size.
 */
export type DERSize = size_t;

/**
 * DER boolean.
 */
export type DERBool = bool;

/**
 * DER memset.
 */
export const DERMemset = memset;

/**
 * DER memcmp.
 */
export const DERMemcmp = memcmp;

/**
 * DER encode enable.
 */
export const DER_ENCODE_ENABLE = 1;

/**
 * DER decode enable.
 */
export const DER_DECODE_ENABLE = 1;

/**
 * DER multibyte tags enable.
 */
export const DER_MULTIBYTE_TAGS = 1;

/**
 * DER tag size.
 */
export const DER_TAG_SIZE = 8;

/**
 * DER tag.
 */
export type DERTag = DERLong;
