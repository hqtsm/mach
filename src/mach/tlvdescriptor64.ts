/* eslint-disable max-classes-per-file */
import {Struct, structU64} from '../struct.ts';

/**
 * Thread local variable entry, 64-bit.
 */
export class TlvDescriptor64 extends Struct {
	public declare readonly ['constructor']: typeof TlvDescriptor64;

	/**
	 * A pointer.
	 */
	public declare thunk: bigint;

	/**
	 * Unsigned long.
	 */
	public declare key: bigint;

	/**
	 * Unsigned long.
	 */
	public declare offset: bigint;

	/**
	 * @inheritdoc
	 */
	public static readonly BYTE_LENGTH = (o => {
		o += structU64(this, o, 'thunk');
		o += structU64(this, o, 'key');
		o += structU64(this, o, 'offset');
		return o;
	})(super.BYTE_LENGTH);
}

/**
 * Thread local variable entry, 64-bit, big endian.
 */
export class TlvDescriptor64BE extends TlvDescriptor64 {
	public declare readonly ['constructor']: typeof TlvDescriptor64BE;

	/**
	 * @inheritdoc
	 */
	public static readonly LITTLE_ENDIAN = false;
}

/**
 * Thread local variable entry, 64-bit, little endian.
 */
export class TlvDescriptor64LE extends TlvDescriptor64 {
	public declare readonly ['constructor']: typeof TlvDescriptor64LE;

	/**
	 * @inheritdoc
	 */
	public static readonly LITTLE_ENDIAN = true;
}
