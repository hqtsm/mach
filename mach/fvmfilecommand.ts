import { constant, member, Struct, uint32 } from '@hqtsm/struct';
import { LcStr } from './lcstr.ts';

/**
 * Fixed virtual memory file command.
 */
export class FvmfileCommand extends Struct {
	declare public readonly ['constructor']: Omit<typeof FvmfileCommand, 'new'>;

	/**
	 * Command type.
	 */
	declare public cmd: number;

	/**
	 * Command size.
	 */
	declare public cmdsize: number;

	/**
	 * File pathname.
	 */
	declare public name: LcStr;

	/**
	 * File virtual address.
	 */
	declare public headerAddr: number;

	static {
		uint32(this, 'cmd');
		uint32(this, 'cmdsize');
		member(LcStr, this, 'name');
		uint32(this, 'headerAddr');
		constant(this, 'BYTE_LENGTH');
	}
}
