/* eslint-disable max-classes-per-file */
import {Struct, structU32} from '../struct.ts';

/**
 * Minimum OS build version command.
 */
export class BuildVersionCommand extends Struct {
	public declare readonly ['constructor']: typeof BuildVersionCommand;

	/**
	 * Command type.
	 */
	public declare cmd: number;

	/**
	 * Command size.
	 */
	public declare cmdsize: number;

	/**
	 * Platform.
	 */
	public declare platform: number;

	/**
	 * X.Y.Z in nibbles xxxx.yy.zz.
	 */
	public declare version: number;

	/**
	 * X.Y.Z in nibbles xxxx.yy.zz.
	 */
	public declare sdk: number;

	/**
	 * Number of tool entries that follow.
	 */
	public declare ntools: number;

	/**
	 * @inheritdoc
	 */
	public static readonly BYTE_LENGTH = (o => {
		o += structU32(this, o, 'cmd');
		o += structU32(this, o, 'cmdsize');
		o += structU32(this, o, 'platform');
		o += structU32(this, o, 'version');
		o += structU32(this, o, 'sdk');
		o += structU32(this, o, 'ntools');
		return o;
	})(super.BYTE_LENGTH);
}

/**
 * Minimum OS build version command, big endian.
 */
export class BuildVersionCommandBE extends BuildVersionCommand {
	public declare readonly ['constructor']: typeof BuildVersionCommandBE;

	/**
	 * @inheritdoc
	 */
	public static readonly LITTLE_ENDIAN = false;
}

/**
 * Minimum OS build version command, little endian.
 */
export class BuildVersionCommandLE extends BuildVersionCommand {
	public declare readonly ['constructor']: typeof BuildVersionCommandLE;

	/**
	 * @inheritdoc
	 */
	public static readonly LITTLE_ENDIAN = true;
}
