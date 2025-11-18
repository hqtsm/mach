import { type Class, constant } from '@hqtsm/class';
import { uint32, Union } from '@hqtsm/struct';

/**
 * Load command string union.
 */
export class LcStr extends Union {
	declare public readonly ['constructor']: Class<typeof LcStr>;

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
