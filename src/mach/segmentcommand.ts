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
		let {sizeof} = this;
		sizeof += memberU32(this, sizeof, 'cmd');
		sizeof += memberU32(this, sizeof, 'cmdsize');
		sizeof += memberI8A(this, sizeof, 'segname', 16);
		sizeof += memberU32(this, sizeof, 'vmaddr');
		sizeof += memberU32(this, sizeof, 'vmsize');
		sizeof += memberU32(this, sizeof, 'fileoff');
		sizeof += memberU32(this, sizeof, 'filesize');
		sizeof += memberI32(this, sizeof, 'maxprot');
		sizeof += memberI32(this, sizeof, 'initprot');
		sizeof += memberU32(this, sizeof, 'nsects');
		sizeof += memberU32(this, sizeof, 'flags');
		constant(this, 'sizeof', sizeof);
	}
}

/**
 * Segment command, 32-bit, big endian.
 */
export class SegmentCommandBE extends SegmentCommand {
	/**
	 * @inheritdoc
	 */
	public static readonly littleEndian = false;

	static {
		constant(this, 'littleEndian');
	}
}

/**
 * Segment command, 32-bit, little endian.
 */
export class SegmentCommandLE extends SegmentCommand {
	/**
	 * @inheritdoc
	 */
	public static readonly littleEndian = true;

	static {
		constant(this, 'littleEndian');
	}
}
