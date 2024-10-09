/* eslint-disable max-classes-per-file */
import {memberU32} from '../member.ts';
import {Struct} from '../struct.ts';
import {constant} from '../util.ts';

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
		let {sizeof} = this;
		sizeof += memberU32(this, sizeof, 'offset');
		// Union because there was a 32-bit char *ptr.
		constant(this, 'sizeof', sizeof);
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
		constant(this, 'LITTLE_ENDIAN');
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
		constant(this, 'LITTLE_ENDIAN');
	}
}
