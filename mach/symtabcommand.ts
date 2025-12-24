import { constant, toStringTag } from '@hqtsm/class';
import { Struct, uint32 } from '@hqtsm/struct';

/**
 * Symtab command.
 */
export class SymtabCommand extends Struct {
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
		toStringTag(this, 'SymtabCommand');
		uint32(this, 'cmd');
		uint32(this, 'cmdsize');
		uint32(this, 'symoff');
		uint32(this, 'nsyms');
		uint32(this, 'stroff');
		uint32(this, 'strsize');
		constant(this, 'BYTE_LENGTH');
	}
}
