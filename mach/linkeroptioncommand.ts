import { constant } from '@hqtsm/class';
import { Struct, uint32 } from '@hqtsm/struct';

/**
 * Linker option command.
 */
export class LinkerOptionCommand extends Struct {
	declare public readonly ['constructor']: Omit<
		typeof LinkerOptionCommand,
		'new'
	>;

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
		constant(this, 'BYTE_LENGTH');
	}
}
