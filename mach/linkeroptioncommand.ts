import { Struct, uint32 } from '@hqtsm/struct';

/**
 * Linker option command.
 */
export class LinkerOptionCommand extends Struct {
	declare public readonly ['constructor']: typeof LinkerOptionCommand;

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
		uint32(this, 'cmd');
		uint32(this, 'cmdsize');
		uint32(this, 'count');
	}
}
