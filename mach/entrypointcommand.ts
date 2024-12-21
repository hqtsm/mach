import { constant, Struct, uint32, uint64 } from '@hqtsm/struct';

/**
 * Entry point command.
 */
export class EntryPointCommand extends Struct {
	declare public readonly ['constructor']: typeof EntryPointCommand;

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
		uint32(this, 'cmd');
		uint32(this, 'cmdsize');
		uint64(this, 'entryoff');
		uint64(this, 'stacksize');
		constant(this, 'BYTE_LENGTH');
	}
}
