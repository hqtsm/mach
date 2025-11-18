import { type Class, constant } from '@hqtsm/class';
import { Struct, uint16, uint32 } from '@hqtsm/struct';

/**
 * Data in code entry.
 */
export class DataInCodeEntry extends Struct {
	declare public readonly ['constructor']: Class<typeof DataInCodeEntry>;

	/**
	 * Offset from mach_header to start of data range.
	 */
	declare public offset: number;

	/**
	 * Data range byte length.
	 */
	declare public length: number;

	/**
	 * Kind (DICE_KIND_*).
	 */
	declare public kind: number;

	static {
		uint32(this, 'offset');
		uint16(this, 'length');
		uint16(this, 'kind');
		constant(this, 'BYTE_LENGTH');
	}
}
