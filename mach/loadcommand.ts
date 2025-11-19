import { type Class, constant, toStringTag } from '@hqtsm/class';
import { Struct, uint32 } from '@hqtsm/struct';

/**
 * Load command.
 */
export class LoadCommand extends Struct {
	declare public readonly ['constructor']: Class<typeof LoadCommand>;

	/**
	 * Command type.
	 */
	declare public cmd: number;

	/**
	 * Command size.
	 */
	declare public cmdsize: number;

	static {
		toStringTag(this, 'LoadCommand');
		uint32(this, 'cmd');
		uint32(this, 'cmdsize');
		constant(this, 'BYTE_LENGTH');
	}
}
