import { constant, member, Struct, uint32 } from '@hqtsm/struct';
import { LcStr } from './lcstr.ts';

/**
 * Sub library command.
 */
export class SubLibraryCommand extends Struct {
	declare public readonly ['constructor']: Omit<
		typeof SubLibraryCommand,
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
	 * The sub_library name.
	 */
	declare public subLibrary: LcStr;

	static {
		uint32(this, 'cmd');
		uint32(this, 'cmdsize');
		member(LcStr, this, 'subLibrary');
		constant(this, 'BYTE_LENGTH');
	}
}
