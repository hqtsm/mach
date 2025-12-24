import { constant, toStringTag } from '@hqtsm/class';
import { Struct, uint32 } from '@hqtsm/struct';

/**
 * Ident command.
 */
export class IdentCommand extends Struct {
	/**
	 * Command type.
	 */
	declare public cmd: number;

	/**
	 * Command size.
	 */
	declare public cmdsize: number;

	static {
		toStringTag(this, 'IdentCommand');
		uint32(this, 'cmd');
		uint32(this, 'cmdsize');
		constant(this, 'BYTE_LENGTH');
	}
}
