/* eslint-disable max-classes-per-file */
import {Struct, structU32, structU64} from '../struct.ts';

/**
 * Dylib module table entry, 64-bit.
 */
export class DylibModule64 extends Struct {
	public declare readonly ['constructor']: typeof DylibModule64;

	/**
	 * Module name index in string table.
	 */
	public declare moduleName: number;

	/**
	 * Index in external symbols.
	 */
	public declare iextdefsym: number;

	/**
	 * Number of external symbols.
	 */
	public declare nextdefsym: number;

	/**
	 * Index in reference symbol table.
	 */
	public declare irefsym: number;

	/**
	 * Number of reference symbol table.
	 */
	public declare nrefsym: number;

	/**
	 * Index in local symbols.
	 */
	public declare ilocalsym: number;

	/**
	 * Number of local symbols.
	 */
	public declare nlocalsym: number;

	/**
	 * Index in external relocations.
	 */
	public declare iextrel: number;

	/**
	 * Number of external relocations.
	 */
	public declare nextrel: number;

	/**
	 * Low 16 bits index of init section.
	 * High 16 bits index of term section.
	 */
	public declare iinitIterm: number;

	/**
	 * Low 16 bits number of init section.
	 * High 16 bits number of term section.
	 */
	public declare ninitNterm: number;

	/**
	 * Size of module info section.
	 */
	public declare objcModuleInfoSize: number;

	/**
	 * Address of start of module info section.
	 */
	public declare objcModuleInfoAddr: bigint;

	/**
	 * @inheritdoc
	 */
	public static readonly BYTE_LENGTH = (o => {
		o += structU32(this, o, 'moduleName');
		o += structU32(this, o, 'iextdefsym');
		o += structU32(this, o, 'nextdefsym');
		o += structU32(this, o, 'irefsym');
		o += structU32(this, o, 'nrefsym');
		o += structU32(this, o, 'ilocalsym');
		o += structU32(this, o, 'nlocalsym');
		o += structU32(this, o, 'iextrel');
		o += structU32(this, o, 'nextrel');
		o += structU32(this, o, 'iinitIterm');
		o += structU32(this, o, 'ninitNterm');
		o += structU32(this, o, 'objcModuleInfoSize');
		o += structU64(this, o, 'objcModuleInfoAddr');
		return o;
	})(super.BYTE_LENGTH);
}

/**
 * Dylib module table entry, 64-bit, big endian.
 */
export class DylibModule64BE extends DylibModule64 {
	public declare readonly ['constructor']: typeof DylibModule64BE;

	/**
	 * @inheritdoc
	 */
	public static readonly LITTLE_ENDIAN = false;
}

/**
 * Dylib module table entry, 64-bit, little endian.
 */
export class DylibModule64LE extends DylibModule64 {
	public declare readonly ['constructor']: typeof DylibModule64LE;

	/**
	 * @inheritdoc
	 */
	public static readonly LITTLE_ENDIAN = true;
}
