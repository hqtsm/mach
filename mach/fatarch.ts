import { constant, int32, Struct, uint32 } from '@hqtsm/struct';

/**
 * Fat architecture, 32-bit.
 */
export class FatArch extends Struct {
	declare public readonly ['constructor']: Omit<typeof FatArch, 'new'>;

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
	declare public offset: number;

	/**
	 * Byte length.
	 */
	declare public size: number;

	/**
	 * Alignment as a power of 2.
	 */
	declare public align: number;

	static {
		int32(this, 'cputype');
		int32(this, 'cpusubtype');
		uint32(this, 'offset');
		uint32(this, 'size');
		uint32(this, 'align');
		constant(this, 'BYTE_LENGTH');
	}
}
