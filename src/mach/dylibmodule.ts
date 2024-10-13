/* eslint-disable max-classes-per-file */
import {Struct, structU32} from '../struct.ts';

/**
 * Dylib module table entry, 32-bit.
 */
export class DylibModule extends Struct {
	public declare readonly ['constructor']: typeof DylibModule;

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
	 * Address of start of module info section.
	 */
	public declare objcModuleInfoAddr: number;

	/**
	 * Size of module info section.
	 */
	public declare objcModuleInfoSize: number;

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
		o += structU32(this, o, 'objcModuleInfoAddr');
		o += structU32(this, o, 'objcModuleInfoSize');
		return o;
	})(super.BYTE_LENGTH);
}

/**
 * Dylib module table entry, 32-bit, big endian.
 */
export class DylibModuleBE extends DylibModule {
	public declare readonly ['constructor']: typeof DylibModuleBE;

	/**
	 * @inheritdoc
	 */
	public static readonly LITTLE_ENDIAN = false;
}

/**
 * Dylib module table entry, 32-bit, little endian.
 */
export class DylibModuleLE extends DylibModule {
	public declare readonly ['constructor']: typeof DylibModuleLE;

	/**
	 * @inheritdoc
	 */
	public static readonly LITTLE_ENDIAN = true;
}
