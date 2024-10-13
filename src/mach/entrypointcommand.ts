/* eslint-disable max-classes-per-file */
import {Struct, structU32, structU64} from '../struct.ts';

/**
 * Entry point command.
 */
export class EntryPointCommand extends Struct {
	public declare readonly ['constructor']: typeof EntryPointCommand;

	/**
	 * Command type.
	 */
	public declare cmd: number;

	/**
	 * Command size.
	 */
	public declare cmdsize: number;

	/**
	 * File __TEXT offset of main entry point.
	 */
	public declare entryoff: bigint;

	/**
	 * Initial stack size, if non-zero.
	 */
	public declare stacksize: bigint;

	/**
	 * @inheritdoc
	 */
	public static readonly BYTE_LENGTH = (o => {
		o += structU32(this, o, 'cmd');
		o += structU32(this, o, 'cmdsize');
		o += structU64(this, o, 'entryoff');
		o += structU64(this, o, 'stacksize');
		return o;
	})(super.BYTE_LENGTH);
}

/**
 * Entry point command, big endian.
 */
export class EntryPointCommandBE extends EntryPointCommand {
	public declare readonly ['constructor']: typeof EntryPointCommandBE;

	/**
	 * @inheritdoc
	 */
	public static readonly LITTLE_ENDIAN = false;
}

/**
 * Entry point command, little endian.
 */
export class EntryPointCommandLE extends EntryPointCommand {
	public declare readonly ['constructor']: typeof EntryPointCommandLE;

	/**
	 * @inheritdoc
	 */
	public static readonly LITTLE_ENDIAN = true;
}
