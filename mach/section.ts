import { Struct, structI8A, structU32 } from '../struct.ts';

/**
 * Section, 32-bit.
 */
export class Section extends Struct {
	declare public readonly ['constructor']: typeof Section;

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
	declare public addr: number;

	/**
	 * Size in bytes.
	 */
	declare public size: number;

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
	 * @inheritdoc
	 */
	public static override readonly BYTE_LENGTH: number = ((o) => {
		o += structI8A(this, o, 'sectname', 16);
		o += structI8A(this, o, 'segname', 16);
		o += structU32(this, o, 'addr');
		o += structU32(this, o, 'size');
		o += structU32(this, o, 'offset');
		o += structU32(this, o, 'align');
		o += structU32(this, o, 'reloff');
		o += structU32(this, o, 'nreloc');
		o += structU32(this, o, 'flags');
		o += structU32(this, o, 'reserved1');
		o += structU32(this, o, 'reserved2');
		return o;
	})(super.BYTE_LENGTH);
}

/**
 * Section, 32-bit, big endian.
 */
export class SectionBE extends Section {
	declare public readonly ['constructor']: typeof SectionBE;

	/**
	 * @inheritdoc
	 */
	public static override readonly LITTLE_ENDIAN = false;
}

/**
 * Section, 32-bit, little endian.
 */
export class SectionLE extends Section {
	declare public readonly ['constructor']: typeof SectionLE;

	/**
	 * @inheritdoc
	 */
	public static override readonly LITTLE_ENDIAN = true;
}
