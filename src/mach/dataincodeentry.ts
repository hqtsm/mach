/* eslint-disable max-classes-per-file */
import {Struct, structU16, structU32} from '../struct.ts';

/**
 * Data in code entry.
 */
export class DataInCodeEntry extends Struct {
	public declare readonly ['constructor']: typeof DataInCodeEntry;

	/**
	 * Offset from mach_header to start of data range.
	 */
	public declare offset: number;

	/**
	 * Data range byte length.
	 */
	public declare length: number;

	/**
	 * Kind (DICE_KIND_*).
	 */
	public declare kind: number;

	/**
	 * @inheritdoc
	 */
	public static readonly BYTE_LENGTH = (o => {
		o += structU32(this, o, 'offset');
		o += structU16(this, o, 'length');
		o += structU16(this, o, 'kind');
		return o;
	})(super.BYTE_LENGTH);
}

/**
 * Data in code entry, big endian.
 */
export class DataInCodeEntryBE extends DataInCodeEntry {
	public declare readonly ['constructor']: typeof DataInCodeEntryBE;

	/**
	 * @inheritdoc
	 */
	public static readonly LITTLE_ENDIAN = false;
}

/**
 * Data in code entry, little endian.
 */
export class DataInCodeEntryLE extends DataInCodeEntry {
	public declare readonly ['constructor']: typeof DataInCodeEntryLE;

	/**
	 * @inheritdoc
	 */
	public static readonly LITTLE_ENDIAN = true;
}
