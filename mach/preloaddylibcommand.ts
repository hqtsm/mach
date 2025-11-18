import { constant } from '@hqtsm/class';
import { member, Struct, uint32 } from '@hqtsm/struct';
import { LcStr } from './lcstr.ts';

/**
 * Preload dylib command.
 */
export class PreloadDylibCommand extends Struct {
	declare public readonly ['constructor']: Omit<
		typeof PreloadDylibCommand,
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
	 * Path name.
	 */
	declare public name: LcStr;

	/**
	 * Number of modules.
	 */
	declare public nmodules: number;

	/**
	 * Bit vector of linked modules.
	 */
	declare public linkedModules: LcStr;

	static {
		uint32(this, 'cmd');
		uint32(this, 'cmdsize');
		member(LcStr, this, 'name');
		uint32(this, 'nmodules');
		member(LcStr, this, 'linkedModules');
		constant(this, 'BYTE_LENGTH');
	}
}
