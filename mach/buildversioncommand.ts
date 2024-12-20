import { Struct, uint32 } from '@hqtsm/struct';

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

	static {
		uint32(this, 'cmd');
		uint32(this, 'cmdsize');
		uint32(this, 'platform');
		uint32(this, 'version');
		uint32(this, 'sdk');
		uint32(this, 'ntools');
	}
}
