// deno-lint-ignore-file camelcase

/**
 * Boolean.
 */
export type bool = boolean;

/**
 * Signed char.
 *
 * @template _ Bit size.
 */
export type char<_ = 8> = number;

/**
 * Unsigned char.
 *
 * @template _ Bit size.
 */
export type uchar<_ = 8> = number;

/**
 * Signed short.
 *
 * @template _ Bit size.
 */
export type short<_ = 16> = number;

/**
 * Unsigned short.
 *
 * @template _ Bit size.
 */
export type ushort<_ = 16> = number;

/**
 * Signed integer.
 *
 * @template _ Bit size.
 */
export type int<_ = 32> = number;

/**
 * Unsigned integer.
 *
 * @template _ Bit size.
 */
export type uint<_ = 32> = number;

/**
 * Size type.
 */
export type size_t = number;

/**
 * Big size type.
 */
export type big_size_t = bigint;

/**
 * Floating point.
 */
export type float = number;

/**
 * Double precision floating point.
 */
export type double = number;

/**
 * Bitfield.
 *
 * @template T Integer type.
 * @template _ Bit size.
 */
export type bitfield<T extends number | bigint, _ extends number = number> = T;
