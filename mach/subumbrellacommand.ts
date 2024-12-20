import { member, Struct, uint32 } from '@hqtsm/struct';
import { LcStr } from './lcstr.ts';

/**
 * Sub umbrella command.
 */
export class SubUmbrellaCommand extends Struct {
	declare public readonly ['constructor']: typeof SubUmbrellaCommand;

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
		uint32(this, 'cmd');
		uint32(this, 'cmdsize');
		member(LcStr, this, 'subUmbrella');
	}
}
