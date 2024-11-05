import { Struct, structU32, structU64 } from '../struct.ts';

/**
 * Routines command, 64-bit.
 */
export class RoutinesCommand64 extends Struct {
	declare public readonly ['constructor']: typeof RoutinesCommand64;

	/**
	 * Command type.
	 */
	declare public cmd: number;

	/**
	 * Command size.
	 */
	declare public cmdsize: number;

	/**
	 * Address of initialization routine.
	 */
	declare public initAddress: bigint;

	/**
	 * Index of initialization routine in module table.
	 */
	declare public initModule: bigint;

	/**
	 * Reserved.
	 */
	declare public reserved1: bigint;

	/**
	 * Reserved.
	 */
	declare public reserved2: bigint;

	/**
	 * Reserved.
	 */
	declare public reserved3: bigint;

	/**
	 * Reserved.
	 */
	declare public reserved4: bigint;

	/**
	 * Reserved.
	 */
	declare public reserved5: bigint;

	/**
	 * Reserved.
	 */
	declare public reserved6: bigint;

	/**
	 * @inheritdoc
	 */
	public static override readonly BYTE_LENGTH: number = ((o) => {
		o += structU32(this, o, 'cmd');
		o += structU32(this, o, 'cmdsize');
		o += structU64(this, o, 'initAddress');
		o += structU64(this, o, 'initModule');
		o += structU64(this, o, 'reserved1');
		o += structU64(this, o, 'reserved2');
		o += structU64(this, o, 'reserved3');
		o += structU64(this, o, 'reserved4');
		o += structU64(this, o, 'reserved5');
		o += structU64(this, o, 'reserved6');
		return o;
	})(super.BYTE_LENGTH);
}

/**
 * Routines command, 64-bit, big endian.
 */
export class RoutinesCommand64BE extends RoutinesCommand64 {
	declare public readonly ['constructor']: typeof RoutinesCommand64BE;

	/**
	 * @inheritdoc
	 */
	public static override readonly LITTLE_ENDIAN = false;
}

/**
 * Routines command, 64-bit, little endian.
 */
export class RoutinesCommand64LE extends RoutinesCommand64 {
	declare public readonly ['constructor']: typeof RoutinesCommand64LE;

	/**
	 * @inheritdoc
	 */
	public static override readonly LITTLE_ENDIAN = true;
}
