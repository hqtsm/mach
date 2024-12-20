import { Struct, uint32 } from '@hqtsm/struct';

/**
 * Dysymtab command.
 */
export class DysymtabCommand extends Struct {
	declare public readonly ['constructor']: typeof DysymtabCommand;

	/**
	 * Command type.
	 */
	declare public cmd: number;

	/**
	 * Command size.
	 */
	declare public cmdsize: number;

	/**
	 * Index of local symbols.
	 */
	declare public ilocalsym: number;

	/**
	 * Number of local symbols.
	 */
	declare public nlocalsym: number;

	/**
	 * Index of externally defined symbols.
	 */
	declare public iextdefsym: number;

	/**
	 * Number of externally defined symbols.
	 */
	declare public nextdefsym: number;

	/**
	 * Index of undefined symbols.
	 */
	declare public iundefsym: number;

	/**
	 * Number of undefined symbols.
	 */
	declare public nundefsym: number;

	/**
	 * Table of contents file offset.
	 */
	declare public tocoff: number;

	/**
	 * Number of table of contents entries.
	 */
	declare public ntoc: number;

	/**
	 * Module table file offset.
	 */
	declare public modtaboff: number;

	/**
	 * Number of module table entries.
	 */
	declare public nmodtab: number;

	/**
	 * Offset of referenced symbol table.
	 */
	declare public extrefsymoff: number;

	/**
	 * Number of referenced symbol table entries.
	 */
	declare public nextrefsyms: number;

	/**
	 * Indirect symbol table file offset.
	 */
	declare public indirectsymoff: number;

	/**
	 * Number of indirect symbol table entries.
	 */
	declare public nindirectsyms: number;

	/**
	 * Offset of external relocation entries.
	 */
	declare public extreloff: number;

	/**
	 * Number of external relocation entries.
	 */
	declare public nextrel: number;

	/**
	 * Offset of local relocation entries.
	 */
	declare public locreloff: number;

	/**
	 * Number of local relocation entries.
	 */
	declare public nlocrel: number;

	static {
		uint32(this, 'cmd');
		uint32(this, 'cmdsize');
		uint32(this, 'ilocalsym');
		uint32(this, 'nlocalsym');
		uint32(this, 'iextdefsym');
		uint32(this, 'nextdefsym');
		uint32(this, 'iundefsym');
		uint32(this, 'nundefsym');
		uint32(this, 'tocoff');
		uint32(this, 'ntoc');
		uint32(this, 'modtaboff');
		uint32(this, 'nmodtab');
		uint32(this, 'extrefsymoff');
		uint32(this, 'nextrefsyms');
		uint32(this, 'indirectsymoff');
		uint32(this, 'nindirectsyms');
		uint32(this, 'extreloff');
		uint32(this, 'nextrel');
		uint32(this, 'locreloff');
		uint32(this, 'nlocrel');
	}
}
