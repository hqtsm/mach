import { type Class, constant } from '@hqtsm/class';
import { Struct, uint32 } from '@hqtsm/struct';

/**
 * Build tool version.
 */
export class BuildToolVersion extends Struct {
	declare public readonly ['constructor']: Class<typeof BuildToolVersion>;

	/**
	 * Tool ID.
	 */
	declare public tool: number;

	/**
	 * Version number.
	 */
	declare public version: number;

	static {
		uint32(this, 'tool');
		uint32(this, 'version');
		constant(this, 'BYTE_LENGTH');
	}
}
