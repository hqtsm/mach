import { type Class, constant } from '@hqtsm/class';
import { Struct, uint32 } from '@hqtsm/struct';

/**
 * Symbol table command.
 */
export class SymsegCommand extends Struct {
	declare public readonly ['constructor']: Class<typeof SymsegCommand>;

	/**
	 * Command type.
	 */
	declare public cmd: number;

	/**
	 * Command size.
	 */
	declare public cmdsize: number;

	/**
	 * Segment offset.
	 */
	declare public offset: number;

	/**
	 * Segment size.
	 */
	declare public size: number;

	static {
		uint32(this, 'cmd');
		uint32(this, 'cmdsize');
		uint32(this, 'offset');
		uint32(this, 'size');
		constant(this, 'BYTE_LENGTH');
	}
}
