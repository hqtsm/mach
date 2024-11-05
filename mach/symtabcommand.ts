import { Struct, structU32 } from '../struct.ts';

/**
 * Symtab command.
 */
export class SymtabCommand extends Struct {
	declare public readonly ['constructor']: typeof SymtabCommand;

	/**
	 * Command type.
	 */
	declare public cmd: number;

	/**
	 * Command size.
	 */
	declare public cmdsize: number;

	/**
	 * Symbol table offset.
	 */
	declare public symoff: number;

	/**
	 * Symbol table entries.
	 */
	declare public nsyms: number;

	/**
	 * String table offset.
	 */
	declare public stroff: number;

	/**
	 * String table byte length.
	 */
	declare public strsize: number;

	/**
	 * @inheritdoc
	 */
	public static override readonly BYTE_LENGTH: number = ((o) => {
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
	declare public readonly ['constructor']: typeof SymtabCommandBE;

	/**
	 * @inheritdoc
	 */
	public static override readonly LITTLE_ENDIAN = false;
}

/**
 * Symtab command, little endian.
 */
export class SymtabCommandLE extends SymtabCommand {
	declare public readonly ['constructor']: typeof SymtabCommandLE;

	/**
	 * @inheritdoc
	 */
	public static override readonly LITTLE_ENDIAN = true;
}
