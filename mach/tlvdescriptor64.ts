import { constant } from '@hqtsm/class';
import { Struct, uint64 } from '@hqtsm/struct';

/**
 * Thread local variable entry, 64-bit.
 */
export class TlvDescriptor64 extends Struct {
	declare public readonly ['constructor']: Omit<
		typeof TlvDescriptor64,
		'new'
	>;

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
		uint64(this, 'thunk');
		uint64(this, 'key');
		uint64(this, 'offset');
		constant(this, 'BYTE_LENGTH');
	}
}
