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

/**
 * Dylib table of contents entry, big endian.
 */
export class DylibTableOfContentsBE extends DylibTableOfContents {
	declare public readonly ['constructor']: typeof DylibTableOfContentsBE;

	/**
	 * @inheritdoc
	 */
	public static override readonly LITTLE_ENDIAN = false;
}

/**
 * Dylib table of contents entry, little endian.
 */
export class DylibTableOfContentsLE extends DylibTableOfContents {
	declare public readonly ['constructor']: typeof DylibTableOfContentsLE;

	/**
	 * @inheritdoc
	 */
	public static override readonly LITTLE_ENDIAN = true;
}
