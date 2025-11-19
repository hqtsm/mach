import { type Class, constant, toStringTag } from '@hqtsm/class';
import { Struct, uint24, uint8 } from '@hqtsm/struct';

/**
 * Two-level namespace lookup hints table entry.
 */
export class TwolevelHint extends Struct {
	declare public readonly ['constructor']: Class<typeof TwolevelHint>;

	/**
	 * Index in symbol table.
	 */
	declare public isubImage: number;

	/**
	 * Flags for reference type.
	 */
	declare public itoc: number;

	static {
		toStringTag(this, 'TwolevelHint');
		uint8(this, 'isubImage');
		uint24(this, 'itoc');
		constant(this, 'BYTE_LENGTH');
	}
}
