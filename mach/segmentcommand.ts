/* eslint-disable max-classes-per-file */
import { Struct, structI32, structI8A, structU32 } from '../struct.ts';

/**
 * Segment command, 32-bit.
 */
export class SegmentCommand extends Struct {
	declare public readonly ['constructor']: typeof SegmentCommand;

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
	declare public vmaddr: number;

	/**
	 * Virtual memory size.
	 */
	declare public vmsize: number;

	/**
	 * File offset.
	 */
	declare public fileoff: number;

	/**
	 * File size.
	 */
	declare public filesize: number;

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
	public static override readonly BYTE_LENGTH = ((o) => {
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
		return o;
	})(super.BYTE_LENGTH);
}

/**
 * Segment command, 32-bit, big endian.
 */
export class SegmentCommandBE extends SegmentCommand {
	declare public readonly ['constructor']: typeof SegmentCommandBE;

	/**
	 * @inheritdoc
	 */
	public static override readonly LITTLE_ENDIAN = false;
}

/**
 * Segment command, 32-bit, little endian.
 */
export class SegmentCommandLE extends SegmentCommand {
	declare public readonly ['constructor']: typeof SegmentCommandLE;

	/**
	 * @inheritdoc
	 */
	public static override readonly LITTLE_ENDIAN = true;
}
