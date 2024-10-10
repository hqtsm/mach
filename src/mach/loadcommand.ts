/* eslint-disable max-classes-per-file */
import {struct, Struct, structU32} from '../struct.ts';

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

	static {
		let {BYTE_LENGTH: o} = this;
		o += structU32(this, o, 'cmd');
		o += structU32(this, o, 'cmdsize');
		struct(this, o);
	}
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

	static {
		struct(this);
	}
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

	static {
		struct(this);
	}
}
