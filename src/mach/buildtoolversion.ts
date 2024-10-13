/* eslint-disable max-classes-per-file */
import {Struct, structU32} from '../struct.ts';

/**
 * Build tool version.
 */
export class BuildToolVersion extends Struct {
	public declare readonly ['constructor']: typeof BuildToolVersion;

	/**
	 * Tool ID.
	 */
	public declare tool: number;

	/**
	 * Version number.
	 */
	public declare version: number;

	/**
	 * @inheritdoc
	 */
	public static readonly BYTE_LENGTH = (o => {
		o += structU32(this, o, 'tool');
		o += structU32(this, o, 'version');
		return o;
	})(super.BYTE_LENGTH);
}

/**
 * Build tool version, big endian.
 */
export class BuildToolVersionBE extends BuildToolVersion {
	public declare readonly ['constructor']: typeof BuildToolVersionBE;

	/**
	 * @inheritdoc
	 */
	public static readonly LITTLE_ENDIAN = false;
}

/**
 * Build tool version, little endian.
 */
export class BuildToolVersionLE extends BuildToolVersion {
	public declare readonly ['constructor']: typeof BuildToolVersionLE;

	/**
	 * @inheritdoc
	 */
	public static readonly LITTLE_ENDIAN = true;
}
