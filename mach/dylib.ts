import { Struct, structT, structU32 } from '../struct.ts';
import { LcStr } from './lcstr.ts';

/**
 * Dynamically linked shared library.
 */
export class Dylib extends Struct {
	declare public readonly ['constructor']: typeof Dylib;

	/**
	 * Pathname.
	 */
	declare public readonly name: this['constructor']['LcStr']['prototype'];

	/**
	 * Build timestamp.
	 */
	declare public timestamp: number;

	/**
	 * Current version.
	 */
	declare public currentVersion: number;

	/**
	 * Compatibility version.
	 */
	declare public compatibilityVersion: number;

	/**
	 * LcStr reference.
	 */
	public static readonly LcStr = LcStr;

	/**
	 * @inheritdoc
	 */
	public static override readonly BYTE_LENGTH: number = ((o) => {
		o += structT(this, o, 'name', 'LcStr');
		o += structU32(this, o, 'timestamp');
		o += structU32(this, o, 'currentVersion');
		o += structU32(this, o, 'compatibilityVersion');
		return o;
	})(super.BYTE_LENGTH);
}
