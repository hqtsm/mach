import { constant } from '@hqtsm/class';
import { Struct, uint24, uint8 } from '@hqtsm/struct';

/**
 * Reference symbol table entry.
 */
export class DylibReference extends Struct {
	declare public readonly ['constructor']: Omit<typeof DylibReference, 'new'>;

	/**
	 * Index in symbol table.
	 */
	declare public isym: number;

	/**
	 * Flags for reference type.
	 */
	declare public flags: number;

	static {
		uint24(this, 'isym');
		uint8(this, 'flags');
		constant(this, 'BYTE_LENGTH');
	}
}
