import { Struct, structT, structU32 } from '../struct.ts';
import { LcStr } from './lcstr.ts';

/**
 * Fixed virtual memory shared library.
 */
export class Fvmlib extends Struct {
	declare public readonly ['constructor']: typeof Fvmlib;

	/**
	 * Target pathname.
	 */
	declare public readonly name: this['constructor']['LcStr']['prototype'];

	/**
	 * Minor version.
	 */
	declare public minorVersion: number;

	/**
	 * Header address.
	 */
	declare public headerAddr: number;

	/**
	 * LcStr reference.
	 */
	public static readonly LcStr = LcStr;

	/**
	 * @inheritdoc
	 */
	public static override readonly BYTE_LENGTH: number = ((o) => {
		o += structT(this, o, 'name', 'LcStr');
		o += structU32(this, o, 'minorVersion');
		o += structU32(this, o, 'headerAddr');
		return o;
	})(super.BYTE_LENGTH);
}
