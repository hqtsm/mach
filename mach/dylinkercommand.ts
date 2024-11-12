import { Struct, structT, structU32 } from '../struct.ts';
import { LcStr } from './lcstr.ts';

/**
 * Dynamic linker command.
 */
export class DylinkerCommand extends Struct {
	declare public readonly ['constructor']: typeof DylinkerCommand;

	/**
	 * Command type.
	 */
	declare public cmd: number;

	/**
	 * Command size.
	 */
	declare public cmdsize: number;

	/**
	 * Path name.
	 */
	declare public readonly name: this['constructor']['LcStr']['prototype'];

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
		o += structT(this, o, 'name', 'LcStr');
		return o;
	})(super.BYTE_LENGTH);
}
