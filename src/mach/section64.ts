/* eslint-disable max-classes-per-file */
import {Struct, structI8A, structU32, structU64} from '../struct.ts';

/**
 * Section, 64-bit.
 */
export class Section64 extends Struct {
	public declare readonly ['constructor']: typeof Section64;

	/**
	 * Section name.
	 */
	public declare readonly sectname: Int8Array;

	/**
	 * Segment name.
	 */
	public declare readonly segname: Int8Array;

	/**
	 * Memory address.
	 */
	public declare addr: bigint;

	/**
	 * Size in bytes.
	 */
	public declare size: bigint;

	/**
	 * File offset.
	 */
	public declare offset: number;

	/**
	 * Alignment (power of 2).
	 */
	public declare align: number;

	/**
	 * File offset of relocations.
	 */
	public declare reloff: number;

	/**
	 * Number of relocations.
	 */
	public declare nreloc: number;

	/**
	 * Flags.
	 */
	public declare flags: number;

	/**
	 * Reserved.
	 */
	public declare reserved1: number;

	/**
	 * Reserved.
	 */
	public declare reserved2: number;

	/**
	 * Reserved.
	 */
	public declare reserved3: number;

	/**
	 * @inheritdoc
	 */
	public static BYTE_LENGTH = (o => {
		o += structI8A(this, o, 'sectname', 16);
		o += structI8A(this, o, 'segname', 16);
		o += structU64(this, o, 'addr');
		o += structU64(this, o, 'size');
		o += structU32(this, o, 'offset');
		o += structU32(this, o, 'align');
		o += structU32(this, o, 'reloff');
		o += structU32(this, o, 'nreloc');
		o += structU32(this, o, 'flags');
		o += structU32(this, o, 'reserved1');
		o += structU32(this, o, 'reserved2');
		o += structU32(this, o, 'reserved3');
		return o;
	})(super.BYTE_LENGTH);
}

/**
 * Section, 64-bit, big endian.
 */
export class Section64BE extends Section64 {
	public declare readonly ['constructor']: typeof Section64BE;

	/**
	 * @inheritdoc
	 */
	public static readonly LITTLE_ENDIAN = false;
}

/**
 * Section, 64-bit, little endian.
 */
export class Section64LE extends Section64 {
	public declare readonly ['constructor']: typeof Section64LE;

	/**
	 * @inheritdoc
	 */
	public static readonly LITTLE_ENDIAN = true;
}
