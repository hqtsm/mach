/* eslint-disable max-classes-per-file */
import {Struct, structU32} from '../struct.ts';

/**
 * Dylib table of contents entry.
 */
export class DylibTableOfContents extends Struct {
	public declare readonly ['constructor']: typeof DylibTableOfContents;

	/**
	 * External symbol index in symbol table.
	 */
	public declare symbolIndex: number;

	/**
	 * Index in module table.
	 */
	public declare moduleIndex: number;

	/**
	 * @inheritdoc
	 */
	public static readonly BYTE_LENGTH = (o => {
		o += structU32(this, o, 'symbolIndex');
		o += structU32(this, o, 'moduleIndex');
		return o;
	})(super.BYTE_LENGTH);
}

/**
 * Dylib table of contents entry, big endian.
 */
export class DylibTableOfContentsBE extends DylibTableOfContents {
	public declare readonly ['constructor']: typeof DylibTableOfContentsBE;

	/**
	 * @inheritdoc
	 */
	public static readonly LITTLE_ENDIAN = false;
}

/**
 * Dylib table of contents entry, little endian.
 */
export class DylibTableOfContentsLE extends DylibTableOfContents {
	public declare readonly ['constructor']: typeof DylibTableOfContentsLE;

	/**
	 * @inheritdoc
	 */
	public static readonly LITTLE_ENDIAN = true;
}
