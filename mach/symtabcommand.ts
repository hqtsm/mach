import { Struct, uint32 } from '@hqtsm/struct';

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

	static {
		uint32(this, 'cmd');
		uint32(this, 'cmdsize');
		uint32(this, 'symoff');
		uint32(this, 'nsyms');
		uint32(this, 'stroff');
		uint32(this, 'strsize');
	}
}
