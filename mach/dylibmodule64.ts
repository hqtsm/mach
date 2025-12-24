import { constant, toStringTag } from '@hqtsm/class';
import { Struct, uint32, uint64 } from '@hqtsm/struct';

/**
 * Dylib module table entry, 64-bit.
 */
export class DylibModule64 extends Struct {
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

	static {
		toStringTag(this, 'DylibModule64');
		uint32(this, 'moduleName');
		uint32(this, 'iextdefsym');
		uint32(this, 'nextdefsym');
		uint32(this, 'irefsym');
		uint32(this, 'nrefsym');
		uint32(this, 'ilocalsym');
		uint32(this, 'nlocalsym');
		uint32(this, 'iextrel');
		uint32(this, 'nextrel');
		uint32(this, 'iinitIterm');
		uint32(this, 'ninitNterm');
		uint32(this, 'objcModuleInfoSize');
		uint64(this, 'objcModuleInfoAddr');
		constant(this, 'BYTE_LENGTH');
	}
}
