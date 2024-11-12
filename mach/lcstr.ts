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
	public static override readonly BYTE_LENGTH: number = ((o) => {
		o += structU32(this, o, 'offset');
		// Union because there was a 32-bit char *ptr.
		return o;
	})(super.BYTE_LENGTH);
}
