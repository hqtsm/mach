import { Struct, uint32 } from '@hqtsm/struct';

/**
 * Two-level namespace lookup hints table command.
 */
export class TwolevelHintsCommand extends Struct {
	declare public readonly ['constructor']: typeof TwolevelHintsCommand;

	/**
	 * Command type.
	 */
	declare public cmd: number;

	/**
	 * Command size.
	 */
	declare public cmdsize: number;

	/**
	 * Hints table offset.
	 */
	declare public offset: number;

	/**
	 * Number of hints in table.
	 */
	declare public nhints: number;

	static {
		uint32(this, 'cmd');
		uint32(this, 'cmdsize');
		uint32(this, 'offset');
		uint32(this, 'nhints');
	}
}
