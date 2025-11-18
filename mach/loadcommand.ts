import { constant } from '@hqtsm/class';
import { Struct, uint32 } from '@hqtsm/struct';

/**
 * Load command.
 */
export class LoadCommand extends Struct {
	declare public readonly ['constructor']: Omit<typeof LoadCommand, 'new'>;

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
		constant(this, 'BYTE_LENGTH');
	}
}
