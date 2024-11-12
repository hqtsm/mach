import { Struct, structT, structU32 } from '../struct.ts';
import { LcStr } from './lcstr.ts';

/**
 * Sub umbrella command.
 */
export class SubUmbrellaCommand extends Struct {
	declare public readonly ['constructor']: typeof SubUmbrellaCommand;

	/**
	 * Command type.
	 */
	declare public cmd: number;

	/**
	 * Command size.
	 */
	declare public cmdsize: number;

	/**
	 * The sub_umbrella framework name.
	 */
	declare public readonly subUmbrella:
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
		o += structT(this, o, 'subUmbrella', 'LcStr');
		return o;
	})(super.BYTE_LENGTH);
}
