/* eslint-disable max-classes-per-file */
import {struct, Struct, structT, structU32} from '../struct.ts';
import {constant} from '../util.ts';
import {LcStr, LcStrBE, LcStrLE} from './lcstr.ts';

/**
 * Fixed virtual memory shared library.
 */
export class Fvmlib extends Struct {
	public declare readonly ['constructor']: typeof Fvmlib;

	/**
	 * Target pathname.
	 */
	public declare readonly name: this['constructor']['LcStr']['prototype'];

	/**
	 * Minor version.
	 */
	public declare minor_version: number;

	/**
	 * Header address.
	 */
	public declare readonly header_addr: number;

	/**
	 * LcStr reference.
	 */
	public static readonly LcStr = LcStr;

	static {
		let {BYTE_LENGTH: o} = this;
		o += structT(this, 'LcStr', o, 'name');
		o += structU32(this, o, 'minor_version');
		o += structU32(this, o, 'header_addr');
		struct(this, o);
		constant(this, 'LcStr');
	}
}

/**
 * Fixed virtual memory shared library, big endian.
 */
export class FvmlibBE extends Fvmlib {
	public declare readonly ['constructor']: typeof FvmlibBE;

	/**
	 * @inheritdoc
	 */
	public static readonly LITTLE_ENDIAN = false;

	/**
	 * @inheritdoc
	 */
	public static readonly LcStr = LcStrBE;

	static {
		struct(this);
		constant(this, 'LcStr');
	}
}

/**
 * Fixed virtual memory shared library, little endian.
 */
export class FvmlibLE extends Fvmlib {
	public declare readonly ['constructor']: typeof FvmlibLE;

	/**
	 * @inheritdoc
	 */
	public static readonly LITTLE_ENDIAN = true;

	/**
	 * @inheritdoc
	 */
	public static readonly LcStr = LcStrLE;

	static {
		struct(this);
		constant(this, 'LcStr');
	}
}
