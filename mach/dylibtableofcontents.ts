import { constant } from '@hqtsm/class';
import { Struct, uint32 } from '@hqtsm/struct';

/**
 * Dylib table of contents entry.
 */
export class DylibTableOfContents extends Struct {
	declare public readonly ['constructor']: Omit<
		typeof DylibTableOfContents,
		'new'
	>;

	/**
	 * External symbol index in symbol table.
	 */
	declare public symbolIndex: number;

	/**
	 * Index in module table.
	 */
	declare public moduleIndex: number;

	static {
		uint32(this, 'symbolIndex');
		uint32(this, 'moduleIndex');
		constant(this, 'BYTE_LENGTH');
	}
}
