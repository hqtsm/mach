import { type Class, constant, toStringTag } from '@hqtsm/class';
import { member, Struct, uint32 } from '@hqtsm/struct';
import { LcStr } from './lcstr.ts';

/**
 * Sub framework command.
 */
export class SubFrameworkCommand extends Struct {
	declare public readonly ['constructor']: Class<typeof SubFrameworkCommand>;

	/**
	 * Command type.
	 */
	declare public cmd: number;

	/**
	 * Command size.
	 */
	declare public cmdsize: number;

	/**
	 * The umbrella framework name.
	 */
	declare public umbrella: LcStr;

	static {
		toStringTag(this, 'SubFrameworkCommand');
		uint32(this, 'cmd');
		uint32(this, 'cmdsize');
		member(LcStr, this, 'umbrella');
		constant(this, 'BYTE_LENGTH');
	}
}
