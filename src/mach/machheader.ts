/* eslint-disable max-classes-per-file */
import {struct, Struct, structI32, structU32} from '../struct.ts';

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

	/**
	 * @inheritdoc
	 */
	public static BYTE_LENGTH = (o => {
		o += structU32(this, o, 'magic');
		o += structI32(this, o, 'cputype');
		o += structI32(this, o, 'cpusubtype');
		o += structU32(this, o, 'filetype');
		o += structU32(this, o, 'ncmds');
		o += structU32(this, o, 'sizeofcmds');
		o += structU32(this, o, 'flags');
		return o;
	})(super.BYTE_LENGTH);

	static {
		struct(this);
	}
}

/**
 * Mach-O header, 32-bit, big endian.
 */
export class MachHeaderBE extends MachHeader {
	public declare readonly ['constructor']: typeof MachHeaderBE;

	/**
	 * @inheritdoc
	 */
	public static readonly LITTLE_ENDIAN = false;

	static {
		struct(this);
	}
}

/**
 * Mach-O header, 32-bit, little endian.
 */
export class MachHeaderLE extends MachHeader {
	public declare readonly ['constructor']: typeof MachHeaderLE;

	/**
	 * @inheritdoc
	 */
	public static readonly LITTLE_ENDIAN = true;

	static {
		struct(this);
	}
}
