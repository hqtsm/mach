import { constant, toStringTag } from '@hqtsm/class';
import { Struct, uint32 } from '@hqtsm/struct';

/**
 * Thread local variable entry, 32-bit.
 */
export class TlvDescriptor extends Struct {
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
		toStringTag(this, 'TlvDescriptor');
		uint32(this, 'thunk');
		uint32(this, 'key');
		uint32(this, 'offset');
		constant(this, 'BYTE_LENGTH');
	}
}
