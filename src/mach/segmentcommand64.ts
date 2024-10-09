/* eslint-disable max-classes-per-file */
import {memberI32, memberI8A, memberU32, memberU64} from '../member.ts';
import {Struct} from '../struct.ts';
import {constant} from '../util.ts';

/**
 * Segment command, 64-bit.
 */
export class SegmentCommand64 extends Struct {
	public declare readonly ['constructor']: typeof SegmentCommand64;

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
	public declare vmaddr: bigint;

	/**
	 * Virtual memory size.
	 */
	public declare vmsize: bigint;

	/**
	 * File offset.
	 */
	public declare fileoff: bigint;

	/**
	 * File size.
	 */
	public declare filesize: bigint;

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
		sizeof += memberU64(this, sizeof, 'vmaddr');
		sizeof += memberU64(this, sizeof, 'vmsize');
		sizeof += memberU64(this, sizeof, 'fileoff');
		sizeof += memberU64(this, sizeof, 'filesize');
		sizeof += memberI32(this, sizeof, 'maxprot');
		sizeof += memberI32(this, sizeof, 'initprot');
		sizeof += memberU32(this, sizeof, 'nsects');
		sizeof += memberU32(this, sizeof, 'flags');
		constant(this, 'sizeof', sizeof);
	}
}

/**
 * Segment command, 64-bit, big endian.
 */
export class SegmentCommand64BE extends SegmentCommand64 {
	/**
	 * @inheritdoc
	 */
	public static readonly LITTLE_ENDIAN = false;

	static {
		constant(this, 'LITTLE_ENDIAN');
	}
}

/**
 * Segment command, 64-bit, little endian.
 */
export class SegmentCommand64LE extends SegmentCommand64 {
	/**
	 * @inheritdoc
	 */
	public static readonly LITTLE_ENDIAN = true;

	static {
		constant(this, 'LITTLE_ENDIAN');
	}
}
