/* eslint-disable max-classes-per-file */
import {Struct, structU32} from '../struct.ts';

/**
 * Two-level namespace lookup hints table command.
 */
export class TwolevelHintsCommand extends Struct {
	public declare readonly ['constructor']: typeof TwolevelHintsCommand;

	/**
	 * Command type.
	 */
	public declare cmd: number;

	/**
	 * Command size.
	 */
	public declare cmdsize: number;

	/**
	 * Hints table offset.
	 */
	public declare offset: number;

	/**
	 * Number of hints in table.
	 */
	public declare nhints: number;

	/**
	 * @inheritdoc
	 */
	public static readonly BYTE_LENGTH = (o => {
		o += structU32(this, o, 'cmd');
		o += structU32(this, o, 'cmdsize');
		o += structU32(this, o, 'offset');
		o += structU32(this, o, 'nhints');
		return o;
	})(super.BYTE_LENGTH);
}

/**
 * Two-level namespace lookup hints table command, big endian.
 */
export class TwolevelHintsCommandBE extends TwolevelHintsCommand {
	public declare readonly ['constructor']: typeof TwolevelHintsCommandBE;

	/**
	 * @inheritdoc
	 */
	public static readonly LITTLE_ENDIAN = false;
}

/**
 * Two-level namespace lookup hints table command, little endian.
 */
export class TwolevelHintsCommandLE extends TwolevelHintsCommand {
	public declare readonly ['constructor']: typeof TwolevelHintsCommandLE;

	/**
	 * @inheritdoc
	 */
	public static readonly LITTLE_ENDIAN = true;
}
