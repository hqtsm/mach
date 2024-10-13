/* eslint-disable max-classes-per-file */
import {Struct, structT, structU32, structU64} from '../struct.ts';
import {LcStr, LcStrBE, LcStrLE} from './lcstr.ts';

/**
 * Fileset entry command.
 */
export class FilesetEntryCommand extends Struct {
	public declare readonly ['constructor']: typeof FilesetEntryCommand;

	/**
	 * Command type.
	 */
	public declare cmd: number;

	/**
	 * Command size.
	 */
	public declare cmdsize: number;

	/**
	 * Virtual memory address.
	 */
	public declare vmaddr: bigint;

	/**
	 * File offset.
	 */
	public declare fileoff: bigint;

	/**
	 * File pathname.
	 */
	public declare readonly entry_id: this['constructor']['LcStr']['prototype'];

	/**
	 * Reserved.
	 */
	public declare reserved: number;

	/**
	 * LcStr reference.
	 */
	public static readonly LcStr = LcStr;

	/**
	 * @inheritdoc
	 */
	public static readonly BYTE_LENGTH = (o => {
		o += structU32(this, o, 'cmd');
		o += structU32(this, o, 'cmdsize');
		o += structU64(this, o, 'vmaddr');
		o += structU64(this, o, 'fileoff');
		o += structT(this, o, 'entry_id', 'LcStr');
		o += structU32(this, o, 'reserved');
		return o;
	})(super.BYTE_LENGTH);
}

/**
 * Fileset entry command, big endian.
 */
export class FilesetEntryCommandBE extends FilesetEntryCommand {
	public declare readonly ['constructor']: typeof FilesetEntryCommandBE;

	/**
	 * @inheritdoc
	 */
	public static readonly LITTLE_ENDIAN = false;

	/**
	 * @inheritdoc
	 */
	public static readonly LcStr = LcStrBE;
}

/**
 * Fileset entry command, little endian.
 */
export class FilesetEntryCommandLE extends FilesetEntryCommand {
	public declare readonly ['constructor']: typeof FilesetEntryCommandLE;

	/**
	 * @inheritdoc
	 */
	public static readonly LITTLE_ENDIAN = true;

	/**
	 * @inheritdoc
	 */
	public static readonly LcStr = LcStrLE;
}
