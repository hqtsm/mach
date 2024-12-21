import { constant, member, Struct, uint32 } from '@hqtsm/struct';
import { LcStr } from './lcstr.ts';

/**
 * Sub framework command.
 */
export class SubFrameworkCommand extends Struct {
	declare public readonly ['constructor']: Omit<
		typeof SubFrameworkCommand,
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
	 * The umbrella framework name.
	 */
	declare public umbrella: LcStr;

	static {
		uint32(this, 'cmd');
		uint32(this, 'cmdsize');
		member(LcStr, this, 'umbrella');
		constant(this, 'BYTE_LENGTH');
	}
}
