// deno-lint-ignore-file camelcase

/**
 * Signed 8-bit integer.
 *
 * @template _ Bit size.
 */
export type int8_t<_ = 8> = number;

/**
 * Signed 16-bit integer.
 *
 * @template _ Bit size.
 */
export type int16_t<_ = 16> = number;

/**
 * Signed 32-bit integer.
 *
 * @template _ Bit size.
 */
export type int32_t<_ = 32> = number;

/**
 * Signed 64-bit integer.
 *
 * @template _ Bit size.
 */
export type int64_t<_ = 64> = bigint;

/**
 * Unsigned 8-bit integer.
 *
 * @template _ Bit size.
 */
export type uint8_t<_ = 8> = number;

/**
 * Unsigned 16-bit integer.
 *
 * @template _ Bit size.
 */
export type uint16_t<_ = 16> = number;

/**
 * Unsigned 32-bit integer.
 *
 * @template _ Bit size.
 */
export type uint32_t<_ = 32> = number;

/**
 * Unsigned 64-bit integer.
 *
 * @template _ Bit size.
 */
export type uint64_t<_ = 64> = bigint;

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
