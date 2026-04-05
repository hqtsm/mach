/**
 * Boolean.
 */
export type bool = boolean;

/**
 * Signed char (8-bit).
 */
export type char = number;

/**
 * Signed char (8-bit).
 */
export type schar = number;

/**
 * Unsigned char (8-bit).
 */
export type uchar = number;

/**
 * Signed short (16-bit).
 */
export type short = number;

/**
 * Signed short (16-bit).
 */
export type sshort = number;

/**
 * Unsigned short (16-bit).
 */
export type ushort = number;

/**
 * Signed integer (32-bit).
 */
export type int = number;

/**
 * Signed integer (32-bit).
 */
export type sint = number;

/**
 * Unsigned integer (32-bit).
 */
export type uint = number;

/**
 * Signed integer (64-bit).
 */
export type llong = bigint;

/**
 * Signed integer (64-bit).
 */
export type sllong = bigint;

/**
 * Unsigned integer (64-bit).
 */
export type ullong = bigint;

/**
 * Floating point (32-bit).
 */
export type float = number;

/**
 * Double precision floating point (64-bit).
 */
export type double = number;

/**
 * Constant modifier.
 */
export type _const<T> = T;

/**
 * Bitfield.
 *
 * @template T Integer type.
 * @template _ Bit size.
 */
export type bitfield<T extends number | bigint, _ extends number = number> = T;
