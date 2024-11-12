import { Struct, structT, structU32 } from '../struct.ts';
import { LcStr } from './lcstr.ts';

/**
 * Sub client command.
 */
export class SubClientCommand extends Struct {
	declare public readonly ['constructor']: typeof SubClientCommand;

	/**
	 * Command type.
	 */
	declare public cmd: number;

	/**
	 * Command size.
	 */
	declare public cmdsize: number;

	/**
	 * The client name.
	 */
	declare public readonly client: this['constructor']['LcStr']['prototype'];

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
		o += structT(this, o, 'client', 'LcStr');
		return o;
	})(super.BYTE_LENGTH);
}
