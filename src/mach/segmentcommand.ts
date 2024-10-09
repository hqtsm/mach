/* eslint-disable max-classes-per-file */
import {memberI32, memberI8A, memberU32} from '../member.ts';
import {Struct} from '../struct.ts';
import {constant} from '../util.ts';

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
		o += memberU32(this, o, 'cmd');
		o += memberU32(this, o, 'cmdsize');
		o += memberI8A(this, o, 'segname', 16);
		o += memberU32(this, o, 'vmaddr');
		o += memberU32(this, o, 'vmsize');
		o += memberU32(this, o, 'fileoff');
		o += memberU32(this, o, 'filesize');
		o += memberI32(this, o, 'maxprot');
		o += memberI32(this, o, 'initprot');
		o += memberU32(this, o, 'nsects');
		o += memberU32(this, o, 'flags');
		constant(this, 'BYTE_LENGTH', o);
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
		constant(this, 'LITTLE_ENDIAN');
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
		constant(this, 'LITTLE_ENDIAN');
	}
}
