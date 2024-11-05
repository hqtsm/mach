/* eslint-disable max-classes-per-file */
import { Struct, structU32 } from '../struct.ts';

/**
 * Load command string union.
 */
export class LcStr extends Struct {
	declare public readonly ['constructor']: typeof LcStr;

	/**
	 * String offset.
	 */
	declare public offset: number;

	/**
	 * @inheritdoc
	 */
	public static override readonly BYTE_LENGTH = ((o) => {
		o += structU32(this, o, 'offset');
		// Union because there was a 32-bit char *ptr.
		return o;
	})(super.BYTE_LENGTH);
}

/**
 * Load command string union, big endian.
 */
export class LcStrBE extends LcStr {
	declare public readonly ['constructor']: typeof LcStrBE;

	/**
	 * @inheritdoc
	 */
	public static override readonly LITTLE_ENDIAN = false;
}

/**
 * Load command string union, little endian.
 */
export class LcStrLE extends LcStr {
	declare public readonly ['constructor']: typeof LcStrLE;

	/**
	 * @inheritdoc
	 */
	public static override readonly LITTLE_ENDIAN = true;
}
