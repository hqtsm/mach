import { type Class, constant, toStringTag } from '@hqtsm/class';
import { member, Struct, uint32 } from '@hqtsm/struct';
import { LcStr } from './lcstr.ts';

/**
 * Sub umbrella command.
 */
export class SubUmbrellaCommand extends Struct {
	declare public readonly ['constructor']: Class<typeof SubUmbrellaCommand>;

	/**
	 * Command type.
	 */
	declare public cmd: number;

	/**
	 * Command size.
	 */
	declare public cmdsize: number;

	/**
	 * The sub_umbrella framework name.
	 */
	declare public subUmbrella: LcStr;

	static {
		toStringTag(this, 'SubUmbrellaCommand');
		uint32(this, 'cmd');
		uint32(this, 'cmdsize');
		member(LcStr, this, 'subUmbrella');
		constant(this, 'BYTE_LENGTH');
	}
}
