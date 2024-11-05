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

/**
 * Build tool version, big endian.
 */
export class BuildToolVersionBE extends BuildToolVersion {
	declare public readonly ['constructor']: typeof BuildToolVersionBE;

	/**
	 * @inheritdoc
	 */
	public static override readonly LITTLE_ENDIAN = false;
}

/**
 * Build tool version, little endian.
 */
export class BuildToolVersionLE extends BuildToolVersion {
	declare public readonly ['constructor']: typeof BuildToolVersionLE;

	/**
	 * @inheritdoc
	 */
	public static override readonly LITTLE_ENDIAN = true;
}
