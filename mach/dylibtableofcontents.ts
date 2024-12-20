import { Struct, uint32 } from '@hqtsm/struct';

/**
 * Dylib table of contents entry.
 */
export class DylibTableOfContents extends Struct {
	declare public readonly ['constructor']: typeof DylibTableOfContents;

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
	}
}
