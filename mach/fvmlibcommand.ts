import { constant, toStringTag } from '@hqtsm/class';
import { member, Struct, uint32 } from '@hqtsm/struct';
import { Fvmlib } from './fvmlib.ts';

/**
 * Fixed virtual memory shared library command.
 */
export class FvmlibCommand extends Struct {
	/**
	 * Command type.
	 */
	declare public cmd: number;

	/**
	 * Command size.
	 */
	declare public cmdsize: number;

	/**
	 * Library identification.
	 */
	declare public fvmlib: Fvmlib;

	static {
		toStringTag(this, 'FvmlibCommand');
		uint32(this, 'cmd');
		uint32(this, 'cmdsize');
		member(Fvmlib, this, 'fvmlib');
		constant(this, 'BYTE_LENGTH');
	}
}
