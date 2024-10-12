/* eslint-disable max-classes-per-file */
import {Struct, structU32} from '../struct.ts';

/**
 * Symtab command.
 */
export class SymtabCommand extends Struct {
	public declare readonly ['constructor']: typeof SymtabCommand;

	/**
	 * Command type.
	 */
	public declare cmd: number;

	/**
	 * Command size.
	 */
	public declare cmdsize: number;

	/**
	 * Symbol table offset.
	 */
	public declare symoff: number;

	/**
	 * Symbol table entries.
	 */
	public declare nsyms: number;

	/**
	 * String table offset.
	 */
	public declare stroff: number;

	/**
	 * String table byte length.
	 */
	public declare strsize: number;

	/**
	 * @inheritdoc
	 */
	public static readonly BYTE_LENGTH = (o => {
		o += structU32(this, o, 'cmd');
		o += structU32(this, o, 'cmdsize');
		o += structU32(this, o, 'symoff');
		o += structU32(this, o, 'nsyms');
		o += structU32(this, o, 'stroff');
		o += structU32(this, o, 'strsize');
		return o;
	})(super.BYTE_LENGTH);
}

/**
 * Symtab command, big endian.
 */
export class SymtabCommandBE extends SymtabCommand {
	public declare readonly ['constructor']: typeof SymtabCommandBE;

	/**
	 * @inheritdoc
	 */
	public static readonly LITTLE_ENDIAN = false;
}

/**
 * Symtab command, little endian.
 */
export class SymtabCommandLE extends SymtabCommand {
	public declare readonly ['constructor']: typeof SymtabCommandLE;

	/**
	 * @inheritdoc
	 */
	public static readonly LITTLE_ENDIAN = true;
}
