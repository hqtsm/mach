import { constant } from '@hqtsm/class';
import {
	type Arr,
	array,
	int32,
	Int8Ptr,
	member,
	Struct,
	uint32,
	uint64,
} from '@hqtsm/struct';

/**
 * Segment command, 64-bit.
 */
export class SegmentCommand64 extends Struct {
	declare public readonly ['constructor']: Omit<
		typeof SegmentCommand64,
		'new'
	>;

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
	declare public segname: Arr<number>;

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

	static {
		uint32(this, 'cmd');
		uint32(this, 'cmdsize');
		member(array(Int8Ptr, 16), this, 'segname');
		uint64(this, 'vmaddr');
		uint64(this, 'vmsize');
		uint64(this, 'fileoff');
		uint64(this, 'filesize');
		int32(this, 'maxprot');
		int32(this, 'initprot');
		uint32(this, 'nsects');
		uint32(this, 'flags');
		constant(this, 'BYTE_LENGTH');
	}
}
