import { toStringTag } from '@hqtsm/class';
import type { int } from '../libc/c.ts';
import type { DERShort, DERSize, DERTag } from './libDER_config.ts';

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
 */
export class DERItemSpec {
	/**
	 * Constructor.
	 *
	 * @param offset Offset.
	 * @param tag Tag.
	 * @param length Length.
	 */
	public constructor(
		offset: DERSize = 0,
		tag: DERTag = 0n,
		length: DERShort = 0,
	) {
		this.offset = offset;
		this.tag = tag;
		this.length = length;
	}

	/**
	 * Offset.
	 */
	public offset: DERSize;

	/**
	 * Tag.
	 */
	public tag: DERTag;

	/**
	 * Length.
	 */
	public length: DERShort;

	static {
		toStringTag(this, 'DERItemSpec');
	}
}
