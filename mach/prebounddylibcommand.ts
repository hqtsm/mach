import { constant, toStringTag } from '@hqtsm/class';
import { member, Struct, uint32 } from '@hqtsm/struct';
import { LcStr } from './lcstr.ts';

/**
 * Prebound dynamic library command.
 */
export class PreboundDylibCommand extends Struct {
	/**
	 * Command type.
	 */
	declare public cmd: number;

	/**
	 * Command size.
	 */
	declare public cmdsize: number;

	/**
	 * Path of library.
	 */
	declare public name: LcStr;

	/**
	 * Number of modules in library.
	 */
	declare public nmodules: number;

	/**
	 * Bit vector of linked modules.
	 */
	declare public linkedModules: LcStr;

	static {
		toStringTag(this, 'PreboundDylibCommand');
		uint32(this, 'cmd');
		uint32(this, 'cmdsize');
		member(LcStr, this, 'name');
		uint32(this, 'nmodules');
		member(LcStr, this, 'linkedModules');
		constant(this, 'BYTE_LENGTH');
	}
}
