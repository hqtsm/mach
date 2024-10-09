/* eslint-disable max-classes-per-file */
import {memberU32} from '../member.ts';
import {Struct} from '../struct.ts';
import {constant} from '../util.ts';

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
		o += memberU32(this, o, 'cmd');
		o += memberU32(this, o, 'cmdsize');
		constant(this, 'BYTE_LENGTH', o);
	}
}

/**
 * Load command, big endian.
 */
export class LoadCommandBE extends LoadCommand {
	/**
	 * @inheritdoc
	 */
	public static readonly LITTLE_ENDIAN = false;

	static {
		constant(this, 'LITTLE_ENDIAN');
	}
}

/**
 * Load command, little endian.
 */
export class LoadCommandLE extends LoadCommand {
	/**
	 * @inheritdoc
	 */
	public static readonly LITTLE_ENDIAN = true;

	static {
		constant(this, 'LITTLE_ENDIAN');
	}
}
