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
		let {sizeof} = this;
		sizeof += memberI8A(this, sizeof, 'sectname', 16);
		sizeof += memberI8A(this, sizeof, 'segname', 16);
		sizeof += memberU32(this, sizeof, 'addr');
		sizeof += memberU32(this, sizeof, 'size');
		sizeof += memberU32(this, sizeof, 'offset');
		sizeof += memberU32(this, sizeof, 'align');
		sizeof += memberU32(this, sizeof, 'reloff');
		sizeof += memberU32(this, sizeof, 'nreloc');
		sizeof += memberU32(this, sizeof, 'flags');
		sizeof += memberU32(this, sizeof, 'reserved1');
		sizeof += memberU32(this, sizeof, 'reserved2');
		constant(this, 'sizeof', sizeof);
	}
}

/**
 * Section, 32-bit, big endian.
 */
export class SectionBE extends Section {
	/**
	 * @inheritdoc
	 */
	public static readonly littleEndian = false;

	static {
		constant(this, 'littleEndian');
	}
}

/**
 * Section, 32-bit, little endian.
 */
export class SectionLE extends Section {
	/**
	 * @inheritdoc
	 */
	public static readonly littleEndian = true;

	static {
		constant(this, 'littleEndian');
	}
}
