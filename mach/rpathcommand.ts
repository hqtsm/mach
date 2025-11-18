import { type Class, constant } from '@hqtsm/class';
import { member, Struct, uint32 } from '@hqtsm/struct';
import { LcStr } from './lcstr.ts';

/**
 * Rpath command.
 */
export class RpathCommand extends Struct {
	declare public readonly ['constructor']: Class<typeof RpathCommand>;

	/**
	 * Command type.
	 */
	declare public cmd: number;

	/**
	 * Command size.
	 */
	declare public cmdsize: number;

	/**
	 * Path to add to run path.
	 */
	declare public path: LcStr;

	static {
		uint32(this, 'cmd');
		uint32(this, 'cmdsize');
		member(LcStr, this, 'path');
		constant(this, 'BYTE_LENGTH');
	}
}
