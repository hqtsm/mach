import { Struct, structU64 } from '../struct.ts';

/**
 * Thread local variable entry, 64-bit.
 */
export class TlvDescriptor64 extends Struct {
	declare public readonly ['constructor']: typeof TlvDescriptor64;

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

	/**
	 * @inheritdoc
	 */
	public static override readonly BYTE_LENGTH: number = ((o) => {
		o += structU64(this, o, 'thunk');
		o += structU64(this, o, 'key');
		o += structU64(this, o, 'offset');
		return o;
	})(super.BYTE_LENGTH);
}
