/* eslint-disable max-classes-per-file */
import {struct, Struct, structU32} from '../struct.ts';

/**
 * Load command string union.
 */
export class LcStr extends Struct {
	public declare readonly ['constructor']: typeof LcStr;

	/**
	 * String offset.
	 */
	public declare offset: number;

	static {
		let {BYTE_LENGTH: o} = this;
		o += structU32(this, o, 'offset');
		// Union because there was a 32-bit char *ptr.
		struct(this, o);
	}
}

/**
 * Load command string union, big endian.
 */
export class LcStrBE extends LcStr {
	/**
	 * @inheritdoc
	 */
	public static readonly LITTLE_ENDIAN = false;

	static {
		struct(this);
	}
}

/**
 * Load command string union, little endian.
 */
export class LcStrLE extends LcStr {
	/**
	 * @inheritdoc
	 */
	public static readonly LITTLE_ENDIAN = true;

	static {
		struct(this);
	}
}
