import { Struct, structI32, structU32 } from '../struct.ts';

/**
 * Mach-O header, 64-bit.
 */
export class MachHeader64 extends Struct {
	declare public readonly ['constructor']: typeof MachHeader64;

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

	/**
	 * @inheritdoc
	 */
	public static override readonly BYTE_LENGTH: number = ((o) => {
		o += structU32(this, o, 'magic');
		o += structI32(this, o, 'cputype');
		o += structI32(this, o, 'cpusubtype');
		o += structU32(this, o, 'filetype');
		o += structU32(this, o, 'ncmds');
		o += structU32(this, o, 'sizeofcmds');
		o += structU32(this, o, 'flags');
		o += structU32(this, o, 'reserved');
		return o;
	})(super.BYTE_LENGTH);
}
