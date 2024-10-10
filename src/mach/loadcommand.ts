/* eslint-disable max-classes-per-file */
import {Struct, structU32} from '../struct.ts';

/**
 * Load command.
 */
export class LoadCommand extends Struct {
	public declare readonly ['constructor']: typeof LoadCommand;

	/**
	 * Command type.
	 */
	public declare cmd: number;

	/**
	 * Command size.
	 */
	public declare cmdsize: number;

	/**
	 * @inheritdoc
	 */
	public static BYTE_LENGTH = (o => {
		o += structU32(this, o, 'cmd');
		o += structU32(this, o, 'cmdsize');
		return o;
	})(super.BYTE_LENGTH);
}

/**
 * Load command, big endian.
 */
export class LoadCommandBE extends LoadCommand {
	public declare readonly ['constructor']: typeof LoadCommandBE;

	/**
	 * @inheritdoc
	 */
	public static readonly LITTLE_ENDIAN = false;
}

/**
 * Load command, little endian.
 */
export class LoadCommandLE extends LoadCommand {
	public declare readonly ['constructor']: typeof LoadCommandLE;

	/**
	 * @inheritdoc
	 */
	public static readonly LITTLE_ENDIAN = true;
}
