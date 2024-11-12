import { Struct, structI8A, structU32, structU64 } from '../struct.ts';

/**
 * Section, 64-bit.
 */
export class Section64 extends Struct {
	declare public readonly ['constructor']: typeof Section64;

	/**
	 * Section name.
	 */
	declare public readonly sectname: Int8Array;

	/**
	 * Segment name.
	 */
	declare public readonly segname: Int8Array;

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

	/**
	 * @inheritdoc
	 */
	public static override readonly BYTE_LENGTH: number = ((o) => {
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
