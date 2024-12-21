import { constant, Struct, uint32 } from '@hqtsm/struct';

/**
 * Load command.
 */
export class LoadCommand extends Struct {
	declare public readonly ['constructor']: typeof LoadCommand;

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
