/* eslint-disable max-classes-per-file */
import {memberI32, memberU32} from './member.ts';
import {Struct} from './struct.ts';
import {constant} from './util.ts';

/**
 * Mach-O header, 32-bit.
 */
export class MachHeader extends Struct {
	public declare readonly ['constructor']: typeof MachHeader;

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

	static {
		let {sizeof} = this;
		sizeof += memberU32(this, sizeof, 'magic');
		sizeof += memberI32(this, sizeof, 'cputype');
		sizeof += memberI32(this, sizeof, 'cpusubtype');
		sizeof += memberU32(this, sizeof, 'filetype');
		sizeof += memberU32(this, sizeof, 'ncmds');
		sizeof += memberU32(this, sizeof, 'sizeofcmds');
		sizeof += memberU32(this, sizeof, 'flags');
		constant(this, 'sizeof', sizeof);
	}
}

/**
 * Mach-O header, 32-bit, big endian.
 */
export class MachHeaderBE extends MachHeader {
	/**
	 * @inheritdoc
	 */
	public static readonly littleEndian = false;

	static {
		constant(this, 'littleEndian');
	}
}

/**
 * Mach-O header, 32-bit, little endian.
 */
export class MachHeaderLE extends MachHeader {
	/**
	 * @inheritdoc
	 */
	public static readonly littleEndian = true;

	static {
		constant(this, 'littleEndian');
	}
}
