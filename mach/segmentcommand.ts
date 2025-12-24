import { constant, toStringTag } from '@hqtsm/class';
import {
	type Arr,
	array,
	int32,
	Int8Ptr,
	member,
	Struct,
	uint32,
} from '@hqtsm/struct';

/**
 * Segment command, 32-bit.
 */
export class SegmentCommand extends Struct {
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

	static {
		toStringTag(this, 'SegmentCommand');
		uint32(this, 'cmd');
		uint32(this, 'cmdsize');
		member(array(Int8Ptr, 16), this, 'segname');
		uint32(this, 'vmaddr');
		uint32(this, 'vmsize');
		uint32(this, 'fileoff');
		uint32(this, 'filesize');
		int32(this, 'maxprot');
		int32(this, 'initprot');
		uint32(this, 'nsects');
		uint32(this, 'flags');
		constant(this, 'BYTE_LENGTH');
	}
}
