import { constant, uint32, Union } from '@hqtsm/struct';

/**
 * Load command string union.
 */
export class LcStr extends Union {
	declare public readonly ['constructor']: Omit<typeof LcStr, 'new'>;

	/**
	 * String offset.
	 */
	declare public offset: number;

	static {
		uint32(this, 'offset');
		// Union because there was a 32-bit char *ptr.
		constant(this, 'BYTE_LENGTH');
	}
}
