/**
 * Boolean.
 */
export type bool = boolean;

/**
 * Signed char.
 */
export type char = number;

/**
 * Unsigned char.
 */
export type uchar = number;

/**
 * Signed short.
 */
export type short = number;

/**
 * Unsigned short.
 */
export type ushort = number;

/**
 * Signed integer.
 */
export type int = number;

/**
 * Unsigned integer.
 */
export type uint = number;

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
