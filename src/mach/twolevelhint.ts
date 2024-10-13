/* eslint-disable max-classes-per-file */
import {Struct, structU24, structU8} from '../struct.ts';

/**
 * Two-level namespace lookup hints table entry.
 */
export class TwolevelHint extends Struct {
	public declare readonly ['constructor']: typeof TwolevelHint;

	/**
	 * Index in symbol table.
	 */
	public declare isub_image: number;

	/**
	 * Flags for reference type.
	 */
	public declare itoc: number;

	/**
	 * @inheritdoc
	 */
	public static readonly BYTE_LENGTH = (o => {
		o += structU8(this, o, 'isub_image');
		o += structU24(this, o, 'itoc');
		return o;
	})(super.BYTE_LENGTH);
}

/**
 * Two-level namespace lookup hints table entry, big endian.
 */
export class TwolevelHintBE extends TwolevelHint {
	public declare readonly ['constructor']: typeof TwolevelHintBE;

	/**
	 * @inheritdoc
	 */
	public static readonly LITTLE_ENDIAN = false;
}

/**
 * Two-level namespace lookup hints table entry, little endian.
 */
export class TwolevelHintLE extends TwolevelHint {
	public declare readonly ['constructor']: typeof TwolevelHintLE;

	/**
	 * @inheritdoc
	 */
	public static readonly LITTLE_ENDIAN = true;
}
