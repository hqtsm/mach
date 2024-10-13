/* eslint-disable max-classes-per-file */
import {Struct, structT, structU32} from '../struct.ts';
import {LcStr, LcStrBE} from './lcstr.ts';

/**
 * Sub library command.
 */
export class SubLibraryCommand extends Struct {
	public declare readonly ['constructor']: typeof SubLibraryCommand;

	/**
	 * Command type.
	 */
	public declare cmd: number;

	/**
	 * Command size.
	 */
	public declare cmdsize: number;

	/**
	 * The sub_library name.
	 */
	// eslint-disable-next-line max-len
	public declare readonly subLibrary: this['constructor']['LcStr']['prototype'];

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
		o += structT(this, o, 'subLibrary', 'LcStr');
		return o;
	})(super.BYTE_LENGTH);
}

/**
 * Sub library command, big endian.
 */
export class SubLibraryCommandBE extends SubLibraryCommand {
	public declare readonly ['constructor']: typeof SubLibraryCommandBE;

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
 * Sub library command, little endian.
 */
export class SubLibraryCommandLE extends SubLibraryCommand {
	public declare readonly ['constructor']: typeof SubLibraryCommandLE;

	/**
	 * @inheritdoc
	 */
	public static readonly LITTLE_ENDIAN = true;

	/**
	 * @inheritdoc
	 */
	public static readonly LcStr = LcStrBE;
}
