import { constant, toStringTag } from '@hqtsm/class';
import { Struct, uint32, uint64 } from '@hqtsm/struct';

/**
 * Entry point command.
 */
export class EntryPointCommand extends Struct {
	/**
	 * Command type.
	 */
	declare public cmd: number;

	/**
	 * Command size.
	 */
	declare public cmdsize: number;

	/**
	 * File __TEXT offset of main entry point.
	 */
	declare public entryoff: bigint;

	/**
	 * Initial stack size, if non-zero.
	 */
	declare public stacksize: bigint;

	static {
		toStringTag(this, 'EntryPointCommand');
		uint32(this, 'cmd');
		uint32(this, 'cmdsize');
		uint64(this, 'entryoff');
		uint64(this, 'stacksize');
		constant(this, 'BYTE_LENGTH');
	}
}
