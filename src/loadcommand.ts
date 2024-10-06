/* eslint-disable max-classes-per-file */
import {memberU32} from './member.ts';
import {Struct} from './struct.ts';
import {constant} from './util.ts';

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
		let {sizeof} = this;
		sizeof += memberU32(this, sizeof, 'cmd');
		sizeof += memberU32(this, sizeof, 'cmdsize');
		constant(this, 'sizeof', sizeof);
	}
}

/**
 * Load command, big endian.
 */
export class LoadCommandBE extends LoadCommand {
	/**
	 * @inheritdoc
	 */
	public static readonly littleEndian = false;

	static {
		constant(this, 'littleEndian');
	}
}

/**
 * Load command, little endian.
 */
export class LoadCommandLE extends LoadCommand {
	/**
	 * @inheritdoc
	 */
	public static readonly littleEndian = true;

	static {
		constant(this, 'littleEndian');
	}
}
