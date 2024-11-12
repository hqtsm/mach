import { Struct, structI32, structU32 } from '../struct.ts';

/**
 * Fat architecture, 32-bit.
 */
export class FatArch extends Struct {
	declare public readonly ['constructor']: typeof FatArch;

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

	/**
	 * @inheritdoc
	 */
	public static override readonly BYTE_LENGTH: number = ((o) => {
		o += structI32(this, o, 'cputype');
		o += structI32(this, o, 'cpusubtype');
		o += structU32(this, o, 'offset');
		o += structU32(this, o, 'size');
		o += structU32(this, o, 'align');
		return o;
	})(super.BYTE_LENGTH);
}
