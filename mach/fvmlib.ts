/* eslint-disable max-classes-per-file */
import { Struct, structT, structU32 } from '../struct.ts';
import { LcStr, LcStrBE, LcStrLE } from './lcstr.ts';

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
	public static override readonly BYTE_LENGTH = ((o) => {
		o += structT(this, o, 'name', 'LcStr');
		o += structU32(this, o, 'minorVersion');
		o += structU32(this, o, 'headerAddr');
		return o;
	})(super.BYTE_LENGTH);
}

/**
 * Fixed virtual memory shared library, big endian.
 */
export class FvmlibBE extends Fvmlib {
	declare public readonly ['constructor']: typeof FvmlibBE;

	/**
	 * @inheritdoc
	 */
	public static override readonly LITTLE_ENDIAN = false;

	/**
	 * @inheritdoc
	 */
	public static override readonly LcStr = LcStrBE;
}

/**
 * Fixed virtual memory shared library, little endian.
 */
export class FvmlibLE extends Fvmlib {
	declare public readonly ['constructor']: typeof FvmlibLE;

	/**
	 * @inheritdoc
	 */
	public static override readonly LITTLE_ENDIAN = true;

	/**
	 * @inheritdoc
	 */
	public static override readonly LcStr = LcStrLE;
}
