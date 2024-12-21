import { constant, member, Struct, uint32 } from '@hqtsm/struct';
import { LcStr } from './lcstr.ts';

/**
 * Dynamic linker command.
 */
export class DylinkerCommand extends Struct {
	declare public readonly ['constructor']: Omit<
		typeof DylinkerCommand,
		'new'
	>;

	/**
	 * Command type.
	 */
	declare public cmd: number;

	/**
	 * Command size.
	 */
	declare public cmdsize: number;

	/**
	 * Path name.
	 */
	declare public name: LcStr;

	static {
		uint32(this, 'cmd');
		uint32(this, 'cmdsize');
		member(LcStr, this, 'name');
		constant(this, 'BYTE_LENGTH');
	}
}
