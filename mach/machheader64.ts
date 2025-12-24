import { constant, toStringTag } from '@hqtsm/class';
import { int32, Struct, uint32 } from '@hqtsm/struct';

/**
 * Mach-O header, 64-bit.
 */
export class MachHeader64 extends Struct {
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

	/**
	 * Reserved.
	 */
	declare public reserved: number;

	static {
		toStringTag(this, 'MachHeader64');
		uint32(this, 'magic');
		int32(this, 'cputype');
		int32(this, 'cpusubtype');
		uint32(this, 'filetype');
		uint32(this, 'ncmds');
		uint32(this, 'sizeofcmds');
		uint32(this, 'flags');
		uint32(this, 'reserved');
		constant(this, 'BYTE_LENGTH');
	}
}
