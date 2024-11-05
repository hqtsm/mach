import { Struct, structT, structU32 } from '../struct.ts';
import { LcStr, LcStrBE, LcStrLE } from './lcstr.ts';

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

/**
 * Dynamically linked shared library, big endian.
 */
export class DylibBE extends Dylib {
	declare public readonly ['constructor']: typeof DylibBE;

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
 * Dynamically linked shared library, little endian.
 */
export class DylibLE extends Dylib {
	declare public readonly ['constructor']: typeof DylibLE;

	/**
	 * @inheritdoc
	 */
	public static override readonly LITTLE_ENDIAN = true;

	/**
	 * @inheritdoc
	 */
	public static override readonly LcStr = LcStrLE;
}
