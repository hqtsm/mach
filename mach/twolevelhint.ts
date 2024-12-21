import { constant, Struct, uint24, uint8 } from '@hqtsm/struct';

/**
 * Two-level namespace lookup hints table entry.
 */
export class TwolevelHint extends Struct {
	declare public readonly ['constructor']: Omit<typeof TwolevelHint, 'new'>;

	/**
	 * Index in symbol table.
	 */
	declare public isubImage: number;

	/**
	 * Flags for reference type.
	 */
	declare public itoc: number;

	static {
		uint8(this, 'isubImage');
		uint24(this, 'itoc');
		constant(this, 'BYTE_LENGTH');
	}
}
