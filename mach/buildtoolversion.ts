import { Struct, uint32 } from '@hqtsm/struct';

/**
 * Build tool version.
 */
export class BuildToolVersion extends Struct {
	declare public readonly ['constructor']: typeof BuildToolVersion;

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
	}
}
