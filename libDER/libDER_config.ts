import type { bool } from '../libc/c.ts';
import type { size_t } from '../libc/stddef.ts';
import type {
	int32_t,
	int64_t,
	uint16_t,
	uint32_t,
	uint64_t,
	uint8_t,
} from '../libc/stdint.ts';

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
