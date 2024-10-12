/* eslint-disable max-classes-per-file */
import {Struct, structU32, structU64} from '../struct.ts';

/**
 * Routines command, 64-bit.
 */
export class RoutinesCommand64 extends Struct {
	public declare readonly ['constructor']: typeof RoutinesCommand64;

	/**
	 * Command type.
	 */
	public declare cmd: number;

	/**
	 * Command size.
	 */
	public declare cmdsize: number;

	/**
	 * Address of initialization routine.
	 */
	public declare init_address: bigint;

	/**
	 * Index of initialization routine in module table.
	 */
	public declare init_module: bigint;

	/**
	 * Reserved.
	 */
	public declare reserved1: bigint;

	/**
	 * Reserved.
	 */
	public declare reserved2: bigint;

	/**
	 * Reserved.
	 */
	public declare reserved3: bigint;

	/**
	 * Reserved.
	 */
	public declare reserved4: bigint;

	/**
	 * Reserved.
	 */
	public declare reserved5: bigint;

	/**
	 * Reserved.
	 */
	public declare reserved6: bigint;

	/**
	 * @inheritdoc
	 */
	public static readonly BYTE_LENGTH = (o => {
		o += structU32(this, o, 'cmd');
		o += structU32(this, o, 'cmdsize');
		o += structU64(this, o, 'init_address');
		o += structU64(this, o, 'init_module');
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
	public declare readonly ['constructor']: typeof RoutinesCommand64BE;

	/**
	 * @inheritdoc
	 */
	public static readonly LITTLE_ENDIAN = false;
}

/**
 * Routines command, 64-bit, little endian.
 */
export class RoutinesCommand64LE extends RoutinesCommand64 {
	public declare readonly ['constructor']: typeof RoutinesCommand64LE;

	/**
	 * @inheritdoc
	 */
	public static readonly LITTLE_ENDIAN = true;
}
