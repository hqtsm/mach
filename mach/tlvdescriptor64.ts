import { type Class, constant, toStringTag } from '@hqtsm/class';
import { Struct, uint64 } from '@hqtsm/struct';

/**
 * Thread local variable entry, 64-bit.
 */
export class TlvDescriptor64 extends Struct {
	declare public readonly ['constructor']: Class<typeof TlvDescriptor64>;

	/**
	 * A pointer.
	 */
	declare public thunk: bigint;

	/**
	 * Unsigned long.
	 */
	declare public key: bigint;

	/**
	 * Unsigned long.
	 */
	declare public offset: bigint;

	static {
		toStringTag(this, 'TlvDescriptor64');
		uint64(this, 'thunk');
		uint64(this, 'key');
		uint64(this, 'offset');
		constant(this, 'BYTE_LENGTH');
	}
}
