import { constant, toStringTag } from '@hqtsm/class';
import { member, Struct, uint32 } from '@hqtsm/struct';
import { LcStr } from './lcstr.ts';

/**
 * Sub client command.
 */
export class SubClientCommand extends Struct {
	/**
	 * Command type.
	 */
	declare public cmd: number;

	/**
	 * Command size.
	 */
	declare public cmdsize: number;

	/**
	 * The client name.
	 */
	declare public client: LcStr;

	static {
		toStringTag(this, 'SubClientCommand');
		uint32(this, 'cmd');
		uint32(this, 'cmdsize');
		member(LcStr, this, 'client');
		constant(this, 'BYTE_LENGTH');
	}
}
