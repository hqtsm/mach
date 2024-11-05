/* eslint-disable max-classes-per-file */
import { Struct, structU32 } from '../struct.ts';

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

	/**
	 * @inheritdoc
	 */
	public static override readonly BYTE_LENGTH = ((o) => {
		o += structU32(this, o, 'cmd');
		o += structU32(this, o, 'cmdsize');
		o += structU32(this, o, 'ilocalsym');
		o += structU32(this, o, 'nlocalsym');
		o += structU32(this, o, 'iextdefsym');
		o += structU32(this, o, 'nextdefsym');
		o += structU32(this, o, 'iundefsym');
		o += structU32(this, o, 'nundefsym');
		o += structU32(this, o, 'tocoff');
		o += structU32(this, o, 'ntoc');
		o += structU32(this, o, 'modtaboff');
		o += structU32(this, o, 'nmodtab');
		o += structU32(this, o, 'extrefsymoff');
		o += structU32(this, o, 'nextrefsyms');
		o += structU32(this, o, 'indirectsymoff');
		o += structU32(this, o, 'nindirectsyms');
		o += structU32(this, o, 'extreloff');
		o += structU32(this, o, 'nextrel');
		o += structU32(this, o, 'locreloff');
		o += structU32(this, o, 'nlocrel');
		return o;
	})(super.BYTE_LENGTH);
}

/**
 * Dysymtab command, big endian.
 */
export class DysymtabCommandBE extends DysymtabCommand {
	declare public readonly ['constructor']: typeof DysymtabCommandBE;

	/**
	 * @inheritdoc
	 */
	public static override readonly LITTLE_ENDIAN = false;
}

/**
 * Dysymtab command, little endian.
 */
export class DysymtabCommandLE extends DysymtabCommand {
	declare public readonly ['constructor']: typeof DysymtabCommandLE;

	/**
	 * @inheritdoc
	 */
	public static override readonly LITTLE_ENDIAN = true;
}
