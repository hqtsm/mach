import { Struct, structU32 } from '../struct.ts';

/**
 * Thread local variable entry, 64-bit.
 */
export class TlvDescriptor extends Struct {
	declare public readonly ['constructor']: typeof TlvDescriptor;

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

	/**
	 * @inheritdoc
	 */
	public static override readonly BYTE_LENGTH: number = ((o) => {
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
	declare public readonly ['constructor']: typeof TlvDescriptorBE;

	/**
	 * @inheritdoc
	 */
	public static override readonly LITTLE_ENDIAN = false;
}

/**
 * Thread local variable entry, 64-bit, little endian.
 */
export class TlvDescriptorLE extends TlvDescriptor {
	declare public readonly ['constructor']: typeof TlvDescriptorLE;

	/**
	 * @inheritdoc
	 */
	public static override readonly LITTLE_ENDIAN = true;
}
