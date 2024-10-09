/* eslint-disable max-classes-per-file */
import {memberI32, memberU32} from '../member.ts';
import {Struct} from '../struct.ts';
import {constant} from '../util.ts';

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
		let {sizeof} = this;
		sizeof += memberU32(this, sizeof, 'magic');
		sizeof += memberI32(this, sizeof, 'cputype');
		sizeof += memberI32(this, sizeof, 'cpusubtype');
		sizeof += memberU32(this, sizeof, 'filetype');
		sizeof += memberU32(this, sizeof, 'ncmds');
		sizeof += memberU32(this, sizeof, 'sizeofcmds');
		sizeof += memberU32(this, sizeof, 'flags');
		sizeof += memberU32(this, sizeof, 'reserved');
		constant(this, 'sizeof', sizeof);
	}
}

/**
 * Mach-O header, 64-bit, big endian.
 */
export class MachHeader64BE extends MachHeader64 {
	/**
	 * @inheritdoc
	 */
	public static readonly LITTLE_ENDIAN = false;

	static {
		constant(this, 'LITTLE_ENDIAN');
	}
}

/**
 * Mach-O header, 64-bit, little endian.
 */
export class MachHeader64LE extends MachHeader64 {
	/**
	 * @inheritdoc
	 */
	public static readonly LITTLE_ENDIAN = true;

	static {
		constant(this, 'LITTLE_ENDIAN');
	}
}
