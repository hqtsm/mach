/* eslint-disable max-classes-per-file */
import {Struct, structT, structU32} from '../struct.ts';
import {LcStr, LcStrBE, LcStrLE} from './lcstr.ts';

/**
 * Dynamically linked shared library.
 */
export class Dylib extends Struct {
	public declare readonly ['constructor']: typeof Dylib;

	/**
	 * Pathname.
	 */
	public declare readonly name: this['constructor']['LcStr']['prototype'];

	/**
	 * Build timestamp.
	 */
	public declare timestamp: number;

	/**
	 * Current version.
	 */
	public declare current_version: number;

	/**
	 * Compatibility version.
	 */
	public declare compatibility_version: number;

	/**
	 * LcStr reference.
	 */
	public static readonly LcStr = LcStr;

	/**
	 * @inheritdoc
	 */
	public static readonly BYTE_LENGTH = (o => {
		o += structT(this, o, 'name', 'LcStr');
		o += structU32(this, o, 'timestamp');
		o += structU32(this, o, 'current_version');
		o += structU32(this, o, 'compatibility_version');
		return o;
	})(super.BYTE_LENGTH);
}

/**
 * Dynamically linked shared library, big endian.
 */
export class DylibBE extends Dylib {
	public declare readonly ['constructor']: typeof DylibBE;

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
 * Dynamically linked shared library, little endian.
 */
export class DylibLE extends Dylib {
	public declare readonly ['constructor']: typeof DylibLE;

	/**
	 * @inheritdoc
	 */
	public static readonly LITTLE_ENDIAN = true;

	/**
	 * @inheritdoc
	 */
	public static readonly LcStr = LcStrLE;
}
