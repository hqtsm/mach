import { Struct, structT, structU32 } from '../struct.ts';
import { LcStr } from './lcstr.ts';

/**
 * Sub library command.
 */
export class SubLibraryCommand extends Struct {
	declare public readonly ['constructor']: typeof SubLibraryCommand;

	/**
	 * Command type.
	 */
	declare public cmd: number;

	/**
	 * Command size.
	 */
	declare public cmdsize: number;

	/**
	 * The sub_library name.
	 */
	declare public readonly subLibrary:
		this['constructor']['LcStr']['prototype'];

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
		o += structT(this, o, 'subLibrary', 'LcStr');
		return o;
	})(super.BYTE_LENGTH);
}
