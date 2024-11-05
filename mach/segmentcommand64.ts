import {
	Struct,
	structI32,
	structI8A,
	structU32,
	structU64,
} from '../struct.ts';

/**
 * Segment command, 64-bit.
 */
export class SegmentCommand64 extends Struct {
	declare public readonly ['constructor']: typeof SegmentCommand64;

	/**
	 * Command type.
	 */
	declare public cmd: number;

	/**
	 * Command size.
	 */
	declare public cmdsize: number;

	/**
	 * Segment name.
	 */
	declare public readonly segname: Int8Array;

	/**
	 * Virtual memory address.
	 */
	declare public vmaddr: bigint;

	/**
	 * Virtual memory size.
	 */
	declare public vmsize: bigint;

	/**
	 * File offset.
	 */
	declare public fileoff: bigint;

	/**
	 * File size.
	 */
	declare public filesize: bigint;

	/**
	 * Maximum virtual memory protection.
	 */
	declare public maxprot: number;

	/**
	 * Initial virtual memory protection.
	 */
	declare public initprot: number;

	/**
	 * Number of sections.
	 */
	declare public nsects: number;

	/**
	 * Flags.
	 */
	declare public flags: number;

	/**
	 * @inheritdoc
	 */
	public static override readonly BYTE_LENGTH: number = ((o) => {
		o += structU32(this, o, 'cmd');
		o += structU32(this, o, 'cmdsize');
		o += structI8A(this, o, 'segname', 16);
		o += structU64(this, o, 'vmaddr');
		o += structU64(this, o, 'vmsize');
		o += structU64(this, o, 'fileoff');
		o += structU64(this, o, 'filesize');
		o += structI32(this, o, 'maxprot');
		o += structI32(this, o, 'initprot');
		o += structU32(this, o, 'nsects');
		o += structU32(this, o, 'flags');
		return o;
	})(super.BYTE_LENGTH);
}

/**
 * Segment command, 64-bit, big endian.
 */
export class SegmentCommand64BE extends SegmentCommand64 {
	declare public readonly ['constructor']: typeof SegmentCommand64BE;

	/**
	 * @inheritdoc
	 */
	public static override readonly LITTLE_ENDIAN = false;
}

/**
 * Segment command, 64-bit, little endian.
 */
export class SegmentCommand64LE extends SegmentCommand64 {
	declare public readonly ['constructor']: typeof SegmentCommand64LE;

	/**
	 * @inheritdoc
	 */
	public static override readonly LITTLE_ENDIAN = true;
}
