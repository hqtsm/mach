import { type Class, constant, toStringTag } from '@hqtsm/class';
import { member, Struct, uint32 } from '@hqtsm/struct';
import { LcStr } from './lcstr.ts';

/**
 * Dynamic linker command.
 */
export class DylinkerCommand extends Struct {
	declare public readonly ['constructor']: Class<typeof DylinkerCommand>;

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
		toStringTag(this, 'DylinkerCommand');
		uint32(this, 'cmd');
		uint32(this, 'cmdsize');
		member(LcStr, this, 'name');
		constant(this, 'BYTE_LENGTH');
	}
}
