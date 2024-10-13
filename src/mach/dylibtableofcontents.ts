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
	public declare symbol_index: number;

	/**
	 * Index in module table.
	 */
	public declare module_index: number;

	/**
	 * @inheritdoc
	 */
	public static readonly BYTE_LENGTH = (o => {
		o += structU32(this, o, 'symbol_index');
		o += structU32(this, o, 'module_index');
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
