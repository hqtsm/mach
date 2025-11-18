import { type Class, constant } from '@hqtsm/class';
import { Struct, uint32 } from '@hqtsm/struct';

/**
 * Linkedit data command.
 */
export class LinkeditDataCommand extends Struct {
	declare public readonly ['constructor']: Class<typeof LinkeditDataCommand>;

	/**
	 * Command type.
	 */
	declare public cmd: number;

	/**
	 * Command size.
	 */
	declare public cmdsize: number;

	/**
	 * File offset of data in __LINKEDIT segment.
	 */
	declare public dataoff: number;

	/**
	 * File size of data in __LINKEDIT segment.
	 */
	declare public datasize: number;

	static {
		uint32(this, 'cmd');
		uint32(this, 'cmdsize');
		uint32(this, 'dataoff');
		uint32(this, 'datasize');
		constant(this, 'BYTE_LENGTH');
	}
}
