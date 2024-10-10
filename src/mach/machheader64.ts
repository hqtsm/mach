/* eslint-disable max-classes-per-file */
import {struct, Struct, structI32, structU32} from '../struct.ts';

/**
 * Mach-O header, 64-bit.
 */
export class MachHeader64 extends Struct {
	public declare readonly ['constructor']: typeof MachHeader64;

	/**
	 * Mach magic.
	 */
	public declare magic: number;

	/**
	 * CPU type.
	 */
	public declare cputype: number;

	/**
	 * Machine type.
	 */
	public declare cpusubtype: number;

	/**
	 * File type.
	 */
	public declare filetype: number;

	/**
	 * Number of load commands.
	 */
	public declare ncmds: number;

	/**
	 * Size of load commands.
	 */
	public declare sizeofcmds: number;

	/**
	 * Flags.
	 */
	public declare flags: number;

	/**
	 * Reserved.
	 */
	public declare reserved: number;

	static {
		let {BYTE_LENGTH: o} = this;
		o += structU32(this, o, 'magic');
		o += structI32(this, o, 'cputype');
		o += structI32(this, o, 'cpusubtype');
		o += structU32(this, o, 'filetype');
		o += structU32(this, o, 'ncmds');
		o += structU32(this, o, 'sizeofcmds');
		o += structU32(this, o, 'flags');
		o += structU32(this, o, 'reserved');
		struct(this, o);
	}
}

/**
 * Mach-O header, 64-bit, big endian.
 */
export class MachHeader64BE extends MachHeader64 {
	public declare readonly ['constructor']: typeof MachHeader64BE;

	/**
	 * @inheritdoc
	 */
	public static readonly LITTLE_ENDIAN = false;

	static {
		struct(this);
	}
}

/**
 * Mach-O header, 64-bit, little endian.
 */
export class MachHeader64LE extends MachHeader64 {
	public declare readonly ['constructor']: typeof MachHeader64LE;

	/**
	 * @inheritdoc
	 */
	public static readonly LITTLE_ENDIAN = true;

	static {
		struct(this);
	}
}
