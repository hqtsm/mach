/* eslint-disable max-classes-per-file */
import {Struct, structU32} from '../struct.ts';

/**
 * Minimum OS version command.
 */
export class VersionMinCommand extends Struct {
	public declare readonly ['constructor']: typeof VersionMinCommand;

	/**
	 * Command type.
	 */
	public declare cmd: number;

	/**
	 * Command size.
	 */
	public declare cmdsize: number;

	/**
	 * X.Y.Z in nibbles xxxx.yy.zz.
	 */
	public declare version: number;

	/**
	 * X.Y.Z in nibbles xxxx.yy.zz.
	 */
	public declare sdk: number;

	/**
	 * @inheritdoc
	 */
	public static readonly BYTE_LENGTH = (o => {
		o += structU32(this, o, 'cmd');
		o += structU32(this, o, 'cmdsize');
		o += structU32(this, o, 'version');
		o += structU32(this, o, 'sdk');
		return o;
	})(super.BYTE_LENGTH);
}

/**
 * Minimum OS version command, big endian.
 */
export class VersionMinCommandBE extends VersionMinCommand {
	public declare readonly ['constructor']: typeof VersionMinCommandBE;

	/**
	 * @inheritdoc
	 */
	public static readonly LITTLE_ENDIAN = false;
}

/**
 * Minimum OS version command, little endian.
 */
export class VersionMinCommandLE extends VersionMinCommand {
	public declare readonly ['constructor']: typeof VersionMinCommandLE;

	/**
	 * @inheritdoc
	 */
	public static readonly LITTLE_ENDIAN = true;
}
