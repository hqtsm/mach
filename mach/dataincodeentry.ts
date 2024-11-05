/* eslint-disable max-classes-per-file */
import { Struct, structU16, structU32 } from '../struct.ts';

/**
 * Data in code entry.
 */
export class DataInCodeEntry extends Struct {
	declare public readonly ['constructor']: typeof DataInCodeEntry;

	/**
	 * Offset from mach_header to start of data range.
	 */
	declare public offset: number;

	/**
	 * Data range byte length.
	 */
	declare public length: number;

	/**
	 * Kind (DICE_KIND_*).
	 */
	declare public kind: number;

	/**
	 * @inheritdoc
	 */
	public static override readonly BYTE_LENGTH = ((o) => {
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
	declare public readonly ['constructor']: typeof DataInCodeEntryBE;

	/**
	 * @inheritdoc
	 */
	public static override readonly LITTLE_ENDIAN = false;
}

/**
 * Data in code entry, little endian.
 */
export class DataInCodeEntryLE extends DataInCodeEntry {
	declare public readonly ['constructor']: typeof DataInCodeEntryLE;

	/**
	 * @inheritdoc
	 */
	public static override readonly LITTLE_ENDIAN = true;
}
