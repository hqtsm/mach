/* eslint-disable max-classes-per-file */
import {struct, Struct, structI32, structI8A, structU32} from '../struct.ts';

/**
 * Segment command, 32-bit.
 */
export class SegmentCommand extends Struct {
	public declare readonly ['constructor']: typeof SegmentCommand;

	/**
	 * Command type.
	 */
	public declare cmd: number;

	/**
	 * Command size.
	 */
	public declare cmdsize: number;

	/**
	 * Segment name.
	 */
	public declare readonly segname: Int8Array;

	/**
	 * Virtual memory address.
	 */
	public declare vmaddr: number;

	/**
	 * Virtual memory size.
	 */
	public declare vmsize: number;

	/**
	 * File offset.
	 */
	public declare fileoff: number;

	/**
	 * File size.
	 */
	public declare filesize: number;

	/**
	 * Maximum virtual memory protection.
	 */
	public declare maxprot: number;

	/**
	 * Initial virtual memory protection.
	 */
	public declare initprot: number;

	/**
	 * Number of sections.
	 */
	public declare nsects: number;

	/**
	 * Flags.
	 */
	public declare flags: number;

	static {
		let {BYTE_LENGTH: o} = this;
		o += structU32(this, o, 'cmd');
		o += structU32(this, o, 'cmdsize');
		o += structI8A(this, o, 'segname', 16);
		o += structU32(this, o, 'vmaddr');
		o += structU32(this, o, 'vmsize');
		o += structU32(this, o, 'fileoff');
		o += structU32(this, o, 'filesize');
		o += structI32(this, o, 'maxprot');
		o += structI32(this, o, 'initprot');
		o += structU32(this, o, 'nsects');
		o += structU32(this, o, 'flags');
		struct(this, o);
	}
}

/**
 * Segment command, 32-bit, big endian.
 */
export class SegmentCommandBE extends SegmentCommand {
	/**
	 * @inheritdoc
	 */
	public static readonly LITTLE_ENDIAN = false;

	static {
		struct(this);
	}
}

/**
 * Segment command, 32-bit, little endian.
 */
export class SegmentCommandLE extends SegmentCommand {
	/**
	 * @inheritdoc
	 */
	public static readonly LITTLE_ENDIAN = true;

	static {
		struct(this);
	}
}
