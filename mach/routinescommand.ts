import { Struct, structU32 } from '../struct.ts';

/**
 * Routines command, 32-bit.
 */
export class RoutinesCommand extends Struct {
	declare public readonly ['constructor']: typeof RoutinesCommand;

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
	declare public initAddress: number;

	/**
	 * Index of initialization routine in module table.
	 */
	declare public initModule: number;

	/**
	 * Reserved.
	 */
	declare public reserved1: number;

	/**
	 * Reserved.
	 */
	declare public reserved2: number;

	/**
	 * Reserved.
	 */
	declare public reserved3: number;

	/**
	 * Reserved.
	 */
	declare public reserved4: number;

	/**
	 * Reserved.
	 */
	declare public reserved5: number;

	/**
	 * Reserved.
	 */
	declare public reserved6: number;

	/**
	 * @inheritdoc
	 */
	public static override readonly BYTE_LENGTH: number = ((o) => {
		o += structU32(this, o, 'cmd');
		o += structU32(this, o, 'cmdsize');
		o += structU32(this, o, 'initAddress');
		o += structU32(this, o, 'initModule');
		o += structU32(this, o, 'reserved1');
		o += structU32(this, o, 'reserved2');
		o += structU32(this, o, 'reserved3');
		o += structU32(this, o, 'reserved4');
		o += structU32(this, o, 'reserved5');
		o += structU32(this, o, 'reserved6');
		return o;
	})(super.BYTE_LENGTH);
}

/**
 * Routines command, 32-bit, big endian.
 */
export class RoutinesCommandBE extends RoutinesCommand {
	declare public readonly ['constructor']: typeof RoutinesCommandBE;

	/**
	 * @inheritdoc
	 */
	public static override readonly LITTLE_ENDIAN = false;
}

/**
 * Routines command, 32-bit, little endian.
 */
export class RoutinesCommandLE extends RoutinesCommand {
	declare public readonly ['constructor']: typeof RoutinesCommandLE;

	/**
	 * @inheritdoc
	 */
	public static override readonly LITTLE_ENDIAN = true;
}
