import { constant, toStringTag } from '@hqtsm/class';
import { Struct, uint32 } from '@hqtsm/struct';

/**
 * Dylib table of contents entry.
 */
export class DylibTableOfContents extends Struct {
	/**
	 * External symbol index in symbol table.
	 */
	declare public symbolIndex: number;

	/**
	 * Index in module table.
	 */
	declare public moduleIndex: number;

	static {
		toStringTag(this, 'DylibTableOfContents');
		uint32(this, 'symbolIndex');
		uint32(this, 'moduleIndex');
		constant(this, 'BYTE_LENGTH');
	}
}
