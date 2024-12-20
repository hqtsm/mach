import { int32, Struct, uint32 } from '@hqtsm/struct';

/**
 * Mach-O header, 32-bit.
 */
export class MachHeader extends Struct {
	declare public readonly ['constructor']: typeof MachHeader;

	/**
	 * Mach magic.
	 */
	declare public magic: number;

	/**
	 * CPU type.
	 */
	declare public cputype: number;

	/**
	 * Machine type.
	 */
	declare public cpusubtype: number;

	/**
	 * File type.
	 */
	declare public filetype: number;

	/**
	 * Number of load commands.
	 */
	declare public ncmds: number;

	/**
	 * Size of load commands.
	 */
	declare public sizeofcmds: number;

	/**
	 * Flags.
	 */
	declare public flags: number;

	static {
		uint32(this, 'magic');
		int32(this, 'cputype');
		int32(this, 'cpusubtype');
		uint32(this, 'filetype');
		uint32(this, 'ncmds');
		uint32(this, 'sizeofcmds');
		uint32(this, 'flags');
	}
}
