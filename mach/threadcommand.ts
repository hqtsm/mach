import { Struct, structU32 } from '../struct.ts';

/**
 * Thread command.
 */
export class ThreadCommand extends Struct {
	declare public readonly ['constructor']: typeof ThreadCommand;

	/**
	 * Command type.
	 */
	declare public cmd: number;

	/**
	 * Command size.
	 */
	declare public cmdsize: number;

	/**
	 * @inheritdoc
	 */
	public static override readonly BYTE_LENGTH: number = ((o) => {
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
