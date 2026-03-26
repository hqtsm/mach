// deno-lint-ignore-file camelcase

import type {
	char,
	int,
	llong,
	short,
	uchar,
	uint,
	ullong,
	ushort,
} from './c.ts';

/**
 * Signed 8-bit integer.
 */
export type int8_t = char;

/**
 * Signed 16-bit integer.
 */
export type int16_t = short;

/**
 * Signed 32-bit integer.
 */
export type int32_t = int;

/**
 * Signed 64-bit integer.
 */
export type int64_t = llong;

/**
 * Unsigned 8-bit integer.
 */
export type uint8_t = uchar;

/**
 * Unsigned 8-bit integer.
 */
export type u_int8_t = uchar;

/**
 * Unsigned 16-bit integer.
 */
export type uint16_t = ushort;

/**
 * Unsigned 16-bit integer.
 */
export type u_int16_t = ushort;

/**
 * Unsigned 32-bit integer.
 */
export type uint32_t = uint;

/**
 * Unsigned 32-bit integer.
 */
export type u_int32_t = uint;

/**
 * Unsigned 64-bit integer.
 */
export type uint64_t = ullong;

/**
 * Unsigned 64-bit integer.
 */
export type u_int64_t = ullong;

/**
 * Maximum signed 8-bit integer.
 */
export const INT8_MAX = 0x7f;

/**
 * Maximum signed 16-bit integer.
 */
export const INT16_MAX = 0x7fff;

/**
 * Maximum signed 32-bit integer.
 */
export const INT32_MAX = 0x7fffffff;

/**
 * Maximum signed 64-bit integer.
 */
export const INT64_MAX = 0x7fffffffffffffffn;

/**
 * Minimum signed 8-bit integer.
 */
export const INT8_MIN = -0x80;

/**
 * Minimum signed 16-bit integer.
 */
export const INT16_MIN = -0x8000;

/**
 * Minimum signed 32-bit integer.
 */
export const INT32_MIN = -0x80000000;

/**
 * Minimum signed 64-bit integer.
 */
export const INT64_MIN = -0x8000000000000000n;

/**
 * Maximum unsigned 8-bit integer.
 */
export const UINT8_MAX = 0xff;

/**
 * Maximum unsigned 16-bit integer.
 */
export const UINT16_MAX = 0xffff;

/**
 * Maximum unsigned 32-bit integer.
 */
export const UINT32_MAX = 0xffffffff;

/**
 * Maximum unsigned 64-bit integer.
 */
export const UINT64_MAX = 0xffffffffffffffffn;
