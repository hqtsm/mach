import { Struct, uint32 } from '@hqtsm/struct';

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

	static {
		uint32(this, 'cmd');
		uint32(this, 'cmdsize');
		uint32(this, 'version');
		uint32(this, 'sdk');
	}
}
