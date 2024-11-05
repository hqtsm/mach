import { Struct, structU32 } from '../struct.ts';

/**
 * Minimum OS build version command.
 */
export class BuildVersionCommand extends Struct {
	declare public readonly ['constructor']: typeof BuildVersionCommand;

	/**
	 * Command type.
	 */
	declare public cmd: number;

	/**
	 * Command size.
	 */
	declare public cmdsize: number;

	/**
	 * Platform.
	 */
	declare public platform: number;

	/**
	 * X.Y.Z in nibbles xxxx.yy.zz.
	 */
	declare public version: number;

	/**
	 * X.Y.Z in nibbles xxxx.yy.zz.
	 */
	declare public sdk: number;

	/**
	 * Number of tool entries that follow.
	 */
	declare public ntools: number;

	/**
	 * @inheritdoc
	 */
	public static override readonly BYTE_LENGTH: number = ((o) => {
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
	declare public readonly ['constructor']: typeof BuildVersionCommandBE;

	/**
	 * @inheritdoc
	 */
	public static override readonly LITTLE_ENDIAN = false;
}

/**
 * Minimum OS build version command, little endian.
 */
export class BuildVersionCommandLE extends BuildVersionCommand {
	declare public readonly ['constructor']: typeof BuildVersionCommandLE;

	/**
	 * @inheritdoc
	 */
	public static override readonly LITTLE_ENDIAN = true;
}
