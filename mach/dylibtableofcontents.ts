import { Struct, structU32 } from '../struct.ts';

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

	/**
	 * @inheritdoc
	 */
	public static override readonly BYTE_LENGTH: number = ((o) => {
		o += structU32(this, o, 'symbolIndex');
		o += structU32(this, o, 'moduleIndex');
		return o;
	})(super.BYTE_LENGTH);
}
