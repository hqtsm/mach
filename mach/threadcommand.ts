import { type Class, constant } from '@hqtsm/class';
import { Struct, uint32 } from '@hqtsm/struct';

/**
 * Thread command.
 */
export class ThreadCommand extends Struct {
	declare public readonly ['constructor']: Class<typeof ThreadCommand>;

	/**
	 * Command type.
	 */
	declare public cmd: number;

	/**
	 * Command size.
	 */
	declare public cmdsize: number;

	static {
		uint32(this, 'cmd');
		uint32(this, 'cmdsize');
		// Contains machine specific data.
		// uint32_t flavor
		// uint32_t count
		// struct XXX_thread_state state
		// ...
		constant(this, 'BYTE_LENGTH');
	}
}
