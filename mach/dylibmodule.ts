/* eslint-disable max-classes-per-file */
import { Struct, structU32 } from '../struct.ts';

/**
 * Dylib module table entry, 32-bit.
 */
export class DylibModule extends Struct {
	declare public readonly ['constructor']: typeof DylibModule;

	/**
	 * Module name index in string table.
	 */
	declare public moduleName: number;

	/**
	 * Index in external symbols.
	 */
	declare public iextdefsym: number;

	/**
	 * Number of external symbols.
	 */
	declare public nextdefsym: number;

	/**
	 * Index in reference symbol table.
	 */
	declare public irefsym: number;

	/**
	 * Number of reference symbol table.
	 */
	declare public nrefsym: number;

	/**
	 * Index in local symbols.
	 */
	declare public ilocalsym: number;

	/**
	 * Number of local symbols.
	 */
	declare public nlocalsym: number;

	/**
	 * Index in external relocations.
	 */
	declare public iextrel: number;

	/**
	 * Number of external relocations.
	 */
	declare public nextrel: number;

	/**
	 * Low 16 bits index of init section.
	 * High 16 bits index of term section.
	 */
	declare public iinitIterm: number;

	/**
	 * Low 16 bits number of init section.
	 * High 16 bits number of term section.
	 */
	declare public ninitNterm: number;

	/**
	 * Address of start of module info section.
	 */
	declare public objcModuleInfoAddr: number;

	/**
	 * Size of module info section.
	 */
	declare public objcModuleInfoSize: number;

	/**
	 * @inheritdoc
	 */
	public static override readonly BYTE_LENGTH = ((o) => {
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
	declare public readonly ['constructor']: typeof DylibModuleBE;

	/**
	 * @inheritdoc
	 */
	public static override readonly LITTLE_ENDIAN = false;
}

/**
 * Dylib module table entry, 32-bit, little endian.
 */
export class DylibModuleLE extends DylibModule {
	declare public readonly ['constructor']: typeof DylibModuleLE;

	/**
	 * @inheritdoc
	 */
	public static override readonly LITTLE_ENDIAN = true;
}
