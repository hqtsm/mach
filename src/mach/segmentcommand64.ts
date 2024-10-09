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
		let {BYTE_LENGTH: o} = this;
		o += memberU32(this, o, 'cmd');
		o += memberU32(this, o, 'cmdsize');
		o += memberI8A(this, o, 'segname', 16);
		o += memberU64(this, o, 'vmaddr');
		o += memberU64(this, o, 'vmsize');
		o += memberU64(this, o, 'fileoff');
		o += memberU64(this, o, 'filesize');
		o += memberI32(this, o, 'maxprot');
		o += memberI32(this, o, 'initprot');
		o += memberU32(this, o, 'nsects');
		o += memberU32(this, o, 'flags');
		constant(this, 'BYTE_LENGTH', o);
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
