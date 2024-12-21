import { constant, member, Struct, uint32, uint64 } from '@hqtsm/struct';
import { LcStr } from './lcstr.ts';

/**
 * Fileset entry command.
 */
export class FilesetEntryCommand extends Struct {
	declare public readonly ['constructor']: typeof FilesetEntryCommand;

	/**
	 * Command type.
	 */
	declare public cmd: number;

	/**
	 * Command size.
	 */
	declare public cmdsize: number;

	/**
	 * Virtual memory address.
	 */
	declare public vmaddr: bigint;

	/**
	 * File offset.
	 */
	declare public fileoff: bigint;

	/**
	 * File pathname.
	 */
	declare public entryId: LcStr;

	/**
	 * Reserved.
	 */
	declare public reserved: number;

	static {
		uint32(this, 'cmd');
		uint32(this, 'cmdsize');
		uint64(this, 'vmaddr');
		uint64(this, 'fileoff');
		member(LcStr, this, 'entryId');
		uint32(this, 'reserved');
		constant(this, 'BYTE_LENGTH');
	}
}
