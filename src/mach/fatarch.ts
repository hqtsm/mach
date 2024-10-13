/* eslint-disable max-classes-per-file */
import {Struct, structI32, structU32} from '../struct.ts';

/**
 * Fat architecture, 32-bit.
 */
export class FatArch extends Struct {
	public declare readonly ['constructor']: typeof FatArch;

	/**
	 * CPU type.
	 */
	public declare cputype: number;

	/**
	 * Machine type.
	 */
	public declare cpusubtype: number;

	/**
	 * File offset.
	 */
	public declare offset: number;

	/**
	 * Byte length.
	 */
	public declare size: number;

	/**
	 * Alignment as a power of 2.
	 */
	public declare align: number;

	/**
	 * @inheritdoc
	 */
	public static readonly BYTE_LENGTH = (o => {
		o += structI32(this, o, 'cputype');
		o += structI32(this, o, 'cpusubtype');
		o += structU32(this, o, 'offset');
		o += structU32(this, o, 'size');
		o += structU32(this, o, 'align');
		return o;
	})(super.BYTE_LENGTH);
}

/**
 * Fat architecture, 32-bit, big endian.
 */
export class FatArchBE extends FatArch {
	public declare readonly ['constructor']: typeof FatArchBE;

	/**
	 * @inheritdoc
	 */
	public static readonly LITTLE_ENDIAN = false;
}

/**
 * Fat architecture, 32-bit, little endian.
 */
export class FatArchLE extends FatArch {
	public declare readonly ['constructor']: typeof FatArchLE;

	/**
	 * @inheritdoc
	 */
	public static readonly LITTLE_ENDIAN = true;
}
