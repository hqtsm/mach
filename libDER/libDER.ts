import { toStringTag } from '@hqtsm/class';
import type { int } from '../libc/c.ts';
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
export class DERItemSpec<T extends string> {
	/**
	 * Offset.
	 */
	public offset: T;

	/**
	 * Tag.
	 */
	public tag: DERTag;

	/**
	 * Options.
	 */
	public options: DERShort;

	/**
	 * Constructor.
	 *
	 * @param offset Offset.
	 * @param tag Tag.
	 * @param options Options.
	 */
	constructor(offset: T, tag: DERTag, options: DERShort) {
		this.offset = offset;
		this.tag = tag;
		this.options = options;
	}

	static {
		toStringTag(this, 'DERItemSpec');
	}
}

/**
 * Get offset of item.
 *
 * @template T Property.
 * @param _type Type.
 * @param offset Offset.
 * @returns Offset.
 */
export const DER_OFFSET = <T extends string>(
	_type: Record<T, DERItem>,
	offset: T,
): T => offset;
