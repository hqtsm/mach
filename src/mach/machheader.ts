/* eslint-disable max-classes-per-file */
import {memberI32, memberU32} from '../member.ts';
import {Struct} from '../struct.ts';
import {constant} from '../util.ts';

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
		let {BYTE_LENGTH: o} = this;
		o += memberU32(this, o, 'magic');
		o += memberI32(this, o, 'cputype');
		o += memberI32(this, o, 'cpusubtype');
		o += memberU32(this, o, 'filetype');
		o += memberU32(this, o, 'ncmds');
		o += memberU32(this, o, 'sizeofcmds');
		o += memberU32(this, o, 'flags');
		constant(this, 'BYTE_LENGTH', o);
	}
}

/**
 * Mach-O header, 32-bit, big endian.
 */
export class MachHeaderBE extends MachHeader {
	/**
	 * @inheritdoc
	 */
	public static readonly LITTLE_ENDIAN = false;

	static {
		constant(this, 'LITTLE_ENDIAN');
	}
}

/**
 * Mach-O header, 32-bit, little endian.
 */
export class MachHeaderLE extends MachHeader {
	/**
	 * @inheritdoc
	 */
	public static readonly LITTLE_ENDIAN = true;

	static {
		constant(this, 'LITTLE_ENDIAN');
	}
}
