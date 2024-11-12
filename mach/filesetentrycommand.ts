import { Struct, structT, structU32, structU64 } from '../struct.ts';
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
	declare public readonly entryId: this['constructor']['LcStr']['prototype'];

	/**
	 * Reserved.
	 */
	declare public reserved: number;

	/**
	 * LcStr reference.
	 */
	public static readonly LcStr = LcStr;

	/**
	 * @inheritdoc
	 */
	public static override readonly BYTE_LENGTH: number = ((o) => {
		o += structU32(this, o, 'cmd');
		o += structU32(this, o, 'cmdsize');
		o += structU64(this, o, 'vmaddr');
		o += structU64(this, o, 'fileoff');
		o += structT(this, o, 'entryId', 'LcStr');
		o += structU32(this, o, 'reserved');
		return o;
	})(super.BYTE_LENGTH);
}
