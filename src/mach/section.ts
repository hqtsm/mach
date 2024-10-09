/* eslint-disable max-classes-per-file */
import {memberI8A, memberU32} from '../member.ts';
import {Struct} from '../struct.ts';
import {constant} from '../util.ts';

/**
 * Section, 32-bit.
 */
export class Section extends Struct {
	public declare readonly ['constructor']: typeof Section;

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
	public declare addr: number;

	/**
	 * Size in bytes.
	 */
	public declare size: number;

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

	static {
		let {BYTE_LENGTH: o} = this;
		o += memberI8A(this, o, 'sectname', 16);
		o += memberI8A(this, o, 'segname', 16);
		o += memberU32(this, o, 'addr');
		o += memberU32(this, o, 'size');
		o += memberU32(this, o, 'offset');
		o += memberU32(this, o, 'align');
		o += memberU32(this, o, 'reloff');
		o += memberU32(this, o, 'nreloc');
		o += memberU32(this, o, 'flags');
		o += memberU32(this, o, 'reserved1');
		o += memberU32(this, o, 'reserved2');
		constant(this, 'BYTE_LENGTH', o);
	}
}

/**
 * Section, 32-bit, big endian.
 */
export class SectionBE extends Section {
	/**
	 * @inheritdoc
	 */
	public static readonly LITTLE_ENDIAN = false;

	static {
		constant(this, 'LITTLE_ENDIAN');
	}
}

/**
 * Section, 32-bit, little endian.
 */
export class SectionLE extends Section {
	/**
	 * @inheritdoc
	 */
	public static readonly LITTLE_ENDIAN = true;

	static {
		constant(this, 'LITTLE_ENDIAN');
	}
}
