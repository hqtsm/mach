import { Struct, structU32 } from '../struct.ts';

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

	/**
	 * @inheritdoc
	 */
	public static override readonly BYTE_LENGTH: number = ((o) => {
		o += structU32(this, o, 'tool');
		o += structU32(this, o, 'version');
		return o;
	})(super.BYTE_LENGTH);
}
