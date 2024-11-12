import { Struct, structU32, structU64 } from '../struct.ts';

/**
 * Dylib module table entry, 64-bit.
 */
export class DylibModule64 extends Struct {
	declare public readonly ['constructor']: typeof DylibModule64;

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
	 * Size of module info section.
	 */
	declare public objcModuleInfoSize: number;

	/**
	 * Address of start of module info section.
	 */
	declare public objcModuleInfoAddr: bigint;

	/**
	 * @inheritdoc
	 */
	public static override readonly BYTE_LENGTH: number = ((o) => {
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
