import { constant, toStringTag } from '@hqtsm/class';
import { Struct, uint32 } from '@hqtsm/struct';

/**
 * Linker option command.
 */
export class LinkerOptionCommand extends Struct {
	/**
	 * Command type.
	 */
	declare public cmd: number;

	/**
	 * Command size.
	 */
	declare public cmdsize: number;

	/**
	 * Number of following strings.
	 */
	declare public count: number;

	static {
		toStringTag(this, 'LinkerOptionCommand');
		uint32(this, 'cmd');
		uint32(this, 'cmdsize');
		uint32(this, 'count');
		constant(this, 'BYTE_LENGTH');
	}
}
