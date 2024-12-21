import { constant, int32, Struct, uint32, uint64 } from '@hqtsm/struct';

/**
 * Fat architecture, 64-bit.
 */
export class FatArch64 extends Struct {
	declare public readonly ['constructor']: Omit<typeof FatArch64, 'new'>;

	/**
	 * CPU type.
	 */
	declare public cputype: number;

	/**
	 * Machine type.
	 */
	declare public cpusubtype: number;

	/**
	 * File offset.
	 */
	declare public offset: bigint;

	/**
	 * Byte length.
	 */
	declare public size: bigint;

	/**
	 * Alignment as a power of 2.
	 */
	declare public align: number;

	/**
	 * Reserved.
	 */
	declare public reserved: number;

	static {
		int32(this, 'cputype');
		int32(this, 'cpusubtype');
		uint64(this, 'offset');
		uint64(this, 'size');
		uint32(this, 'align');
		uint32(this, 'reserved');
		constant(this, 'BYTE_LENGTH');
	}
}
