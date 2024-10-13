/* eslint-disable max-classes-per-file */
import {Struct, structU32} from '../struct.ts';

/**
 * Thread local variable entry, 64-bit.
 */
export class TlvDescriptor extends Struct {
	public declare readonly ['constructor']: typeof TlvDescriptor;

	/**
	 * A pointer.
	 */
	public declare thunk: number;

	/**
	 * Unsigned long.
	 */
	public declare key: number;

	/**
	 * Unsigned long.
	 */
	public declare offset: number;

	/**
	 * @inheritdoc
	 */
	public static readonly BYTE_LENGTH = (o => {
		o += structU32(this, o, 'thunk');
		o += structU32(this, o, 'key');
		o += structU32(this, o, 'offset');
		return o;
	})(super.BYTE_LENGTH);
}

/**
 * Thread local variable entry, 64-bit, big endian.
 */
export class TlvDescriptorBE extends TlvDescriptor {
	public declare readonly ['constructor']: typeof TlvDescriptorBE;

	/**
	 * @inheritdoc
	 */
	public static readonly LITTLE_ENDIAN = false;
}

/**
 * Thread local variable entry, 64-bit, little endian.
 */
export class TlvDescriptorLE extends TlvDescriptor {
	public declare readonly ['constructor']: typeof TlvDescriptorLE;

	/**
	 * @inheritdoc
	 */
	public static readonly LITTLE_ENDIAN = true;
}
