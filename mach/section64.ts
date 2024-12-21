import {
	type Arr,
	array,
	constant,
	Int8Ptr,
	member,
	Struct,
	uint32,
	uint64,
} from '@hqtsm/struct';

/**
 * Section, 64-bit.
 */
export class Section64 extends Struct {
	declare public readonly ['constructor']: Omit<typeof Section64, 'new'>;

	/**
	 * Section name.
	 */
	declare public sectname: Arr<number>;

	/**
	 * Segment name.
	 */
	declare public segname: Arr<number>;

	/**
	 * Memory address.
	 */
	declare public addr: bigint;

	/**
	 * Size in bytes.
	 */
	declare public size: bigint;

	/**
	 * File offset.
	 */
	declare public offset: number;

	/**
	 * Alignment (power of 2).
	 */
	declare public align: number;

	/**
	 * File offset of relocations.
	 */
	declare public reloff: number;

	/**
	 * Number of relocations.
	 */
	declare public nreloc: number;

	/**
	 * Flags.
	 */
	declare public flags: number;

	/**
	 * Reserved.
	 */
	declare public reserved1: number;

	/**
	 * Reserved.
	 */
	declare public reserved2: number;

	/**
	 * Reserved.
	 */
	declare public reserved3: number;

	static {
		member(array(Int8Ptr, 16), this, 'sectname');
		member(array(Int8Ptr, 16), this, 'segname');
		uint64(this, 'addr');
		uint64(this, 'size');
		uint32(this, 'offset');
		uint32(this, 'align');
		uint32(this, 'reloff');
		uint32(this, 'nreloc');
		uint32(this, 'flags');
		uint32(this, 'reserved1');
		uint32(this, 'reserved2');
		uint32(this, 'reserved3');
		constant(this, 'BYTE_LENGTH');
	}
}
