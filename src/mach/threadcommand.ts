/* eslint-disable max-classes-per-file */
import {Struct, structU32} from '../struct.ts';

/**
 * Thread command.
 */
export class ThreadCommand extends Struct {
	public declare readonly ['constructor']: typeof ThreadCommand;

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
	public static readonly BYTE_LENGTH = (o => {
		o += structU32(this, o, 'cmd');
		o += structU32(this, o, 'cmdsize');
		// Contains machine specific data.
		// uint32_t flavor
		// uint32_t count
		// struct XXX_thread_state state
		// ...
		return o;
	})(super.BYTE_LENGTH);
}

/**
 * Thread command, big endian.
 */
export class ThreadCommandBE extends ThreadCommand {
	public declare readonly ['constructor']: typeof ThreadCommandBE;

	/**
	 * @inheritdoc
	 */
	public static readonly LITTLE_ENDIAN = false;
}

/**
 * Thread command, little endian.
 */
export class ThreadCommandLE extends ThreadCommand {
	public declare readonly ['constructor']: typeof ThreadCommandLE;

	/**
	 * @inheritdoc
	 */
	public static readonly LITTLE_ENDIAN = true;
}
