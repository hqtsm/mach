import type { int } from '../libc/mod.ts';
import type { DERShort, DERTag } from './libDER_config.ts';
import type { DERItem } from './DERItem.ts';

// enum {

/**
 * Success return.
 */
export const DR_Success = 0;

/**
 * End of sequence.
 */
export const DR_EndOfSequence = 1;

/**
 * Unexpected tag.
 */
export const DR_UnexpectedTag = 2;

/**
 * Decode error.
 */
export const DR_DecodeError = 3;

/**
 * Unimplemented.
 */
export const DR_Unimplemented = 4;

/**
 * Incomplete sequence.
 */
export const DR_IncompleteSeq = 5;

/**
 * Parameter error.
 */
export const DR_ParamErr = 6;

/**
 * Buffer overflow.
 */
export const DR_BufOverflow = 7;

/**
 * Error returns.
 */
export type DERReturn =
	& int
	& (
		| typeof DR_Success
		| typeof DR_EndOfSequence
		| typeof DR_UnexpectedTag
		| typeof DR_DecodeError
		| typeof DR_Unimplemented
		| typeof DR_IncompleteSeq
		| typeof DR_ParamErr
		| typeof DR_BufOverflow
	);

// }

/**
 * DER item spec.
 *
 * @template T Property.
 */
export type DERItemSpec<T extends string = string> = readonly [
	T,
	DERTag,
	DERShort,
];

/**
 * Get offsets of item.
 *
 * @template T Type.
 * @returns Offset.
 */
export type DER_OFFSET<T> = {
	[K in keyof T]: T[K] extends DERItem ? K : never;
}[keyof T];
