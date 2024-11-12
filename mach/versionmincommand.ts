import { Struct, structU32 } from '../struct.ts';

/**
 * Minimum OS version command.
 */
export class VersionMinCommand extends Struct {
	declare public readonly ['constructor']: typeof VersionMinCommand;

	/**
	 * Command type.
	 */
	declare public cmd: number;

	/**
	 * Command size.
	 */
	declare public cmdsize: number;

	/**
	 * X.Y.Z in nibbles xxxx.yy.zz.
	 */
	declare public version: number;

	/**
	 * X.Y.Z in nibbles xxxx.yy.zz.
	 */
	declare public sdk: number;

	/**
	 * @inheritdoc
	 */
	public static override readonly BYTE_LENGTH: number = ((o) => {
		o += structU32(this, o, 'cmd');
		o += structU32(this, o, 'cmdsize');
		o += structU32(this, o, 'version');
		o += structU32(this, o, 'sdk');
		return o;
	})(super.BYTE_LENGTH);
}
