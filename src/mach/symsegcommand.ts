/* eslint-disable max-classes-per-file */
import {Struct, structU32} from '../struct.ts';

/**
 * Symbol table command.
 */
export class SymsegCommand extends Struct {
	public declare readonly ['constructor']: typeof SymsegCommand;

	/**
	 * Command type.
	 */
	public declare cmd: number;

	/**
	 * Command size.
	 */
	public declare cmdsize: number;

	/**
	 * Segment offset.
	 */
	public declare offset: number;

	/**
	 * Segment size.
	 */
	public declare size: number;

	/**
	 * @inheritdoc
	 */
	public static readonly BYTE_LENGTH = (o => {
		o += structU32(this, o, 'cmd');
		o += structU32(this, o, 'cmdsize');
		o += structU32(this, o, 'offset');
		o += structU32(this, o, 'size');
		return o;
	})(super.BYTE_LENGTH);
}

/**
 * Symbol table, big endian.
 */
export class SymsegCommandBE extends SymsegCommand {
	public declare readonly ['constructor']: typeof SymsegCommandBE;

	/**
	 * @inheritdoc
	 */
	public static readonly LITTLE_ENDIAN = false;
}

/**
 * Symbol table, little endian.
 */
export class SymsegCommandLE extends SymsegCommand {
	public declare readonly ['constructor']: typeof SymsegCommandLE;

	/**
	 * @inheritdoc
	 */
	public static readonly LITTLE_ENDIAN = true;
}
