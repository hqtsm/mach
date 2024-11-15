import { Struct, structI32, structU32, structU64 } from '../struct.ts';

/**
 * Fat architecture, 64-bit.
 */
export class FatArch64 extends Struct {
	declare public readonly ['constructor']: typeof FatArch64;

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

	/**
	 * @inheritdoc
	 */
	public static override readonly BYTE_LENGTH: number = ((o) => {
		o += structI32(this, o, 'cputype');
		o += structI32(this, o, 'cpusubtype');
		o += structU64(this, o, 'offset');
		o += structU64(this, o, 'size');
		o += structU32(this, o, 'align');
		o += structU32(this, o, 'reserved');
		return o;
	})(super.BYTE_LENGTH);
}
