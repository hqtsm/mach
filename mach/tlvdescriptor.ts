import { constant } from '@hqtsm/class';
import { Struct, uint32 } from '@hqtsm/struct';

/**
 * Thread local variable entry, 64-bit.
 */
export class TlvDescriptor extends Struct {
	declare public readonly ['constructor']: Omit<typeof TlvDescriptor, 'new'>;

	/**
	 * A pointer.
	 */
	declare public thunk: number;

	/**
	 * Unsigned long.
	 */
	declare public key: number;

	/**
	 * Unsigned long.
	 */
	declare public offset: number;

	static {
		uint32(this, 'thunk');
		uint32(this, 'key');
		uint32(this, 'offset');
		constant(this, 'BYTE_LENGTH');
	}
}
