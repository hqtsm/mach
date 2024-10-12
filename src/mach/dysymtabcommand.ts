/* eslint-disable max-classes-per-file */
import {Struct, structU32} from '../struct.ts';

/**
 * Dysymtab command.
 */
export class DysymtabCommand extends Struct {
	public declare readonly ['constructor']: typeof DysymtabCommand;

	/**
	 * Command type.
	 */
	public declare cmd: number;

	/**
	 * Command size.
	 */
	public declare cmdsize: number;

	/**
	 * Index of local symbols.
	 */
	public declare ilocalsym: number;

	/**
	 * Number of local symbols.
	 */
	public declare nlocalsym: number;

	/**
	 * Index of externally defined symbols.
	 */
	public declare iextdefsym: number;

	/**
	 * Number of externally defined symbols.
	 */
	public declare nextdefsym: number;

	/**
	 * Index of undefined symbols.
	 */
	public declare iundefsym: number;

	/**
	 * Number of undefined symbols.
	 */
	public declare nundefsym: number;

	/**
	 * Table of contents file offset.
	 */
	public declare tocoff: number;

	/**
	 * Number of table of contents entries.
	 */
	public declare ntoc: number;

	/**
	 * Module table file offset.
	 */
	public declare modtaboff: number;

	/**
	 * Number of module table entries.
	 */
	public declare nmodtab: number;

	/**
	 * Offset of referenced symbol table.
	 */
	public declare extrefsymoff: number;

	/**
	 * Number of referenced symbol table entries.
	 */
	public declare nextrefsyms: number;

	/**
	 * Indirect symbol table file offset.
	 */
	public declare indirectsymoff: number;

	/**
	 * Number of indirect symbol table entries.
	 */
	public declare nindirectsyms: number;

	/**
	 * Offset of external relocation entries.
	 */
	public declare extreloff: number;

	/**
	 * Number of external relocation entries.
	 */
	public declare nextrel: number;

	/**
	 * Offset of local relocation entries.
	 */
	public declare locreloff: number;

	/**
	 * Number of local relocation entries.
	 */
	public declare nlocrel: number;

	/**
	 * @inheritdoc
	 */
	public static readonly BYTE_LENGTH = (o => {
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
	public declare readonly ['constructor']: typeof DysymtabCommandBE;

	/**
	 * @inheritdoc
	 */
	public static readonly LITTLE_ENDIAN = false;
}

/**
 * Dysymtab command, little endian.
 */
export class DysymtabCommandLE extends DysymtabCommand {
	public declare readonly ['constructor']: typeof DysymtabCommandLE;

	/**
	 * @inheritdoc
	 */
	public static readonly LITTLE_ENDIAN = true;
}
