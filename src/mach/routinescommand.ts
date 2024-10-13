/* eslint-disable max-classes-per-file */
import {Struct, structU32} from '../struct.ts';

/**
 * Routines command, 32-bit.
 */
export class RoutinesCommand extends Struct {
	public declare readonly ['constructor']: typeof RoutinesCommand;

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
	public declare initAddress: number;

	/**
	 * Index of initialization routine in module table.
	 */
	public declare initModule: number;

	/**
	 * Reserved.
	 */
	public declare reserved1: number;

	/**
	 * Reserved.
	 */
	public declare reserved2: number;

	/**
	 * Reserved.
	 */
	public declare reserved3: number;

	/**
	 * Reserved.
	 */
	public declare reserved4: number;

	/**
	 * Reserved.
	 */
	public declare reserved5: number;

	/**
	 * Reserved.
	 */
	public declare reserved6: number;

	/**
	 * @inheritdoc
	 */
	public static readonly BYTE_LENGTH = (o => {
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
	public declare readonly ['constructor']: typeof RoutinesCommandBE;

	/**
	 * @inheritdoc
	 */
	public static readonly LITTLE_ENDIAN = false;
}

/**
 * Routines command, 32-bit, little endian.
 */
export class RoutinesCommandLE extends RoutinesCommand {
	public declare readonly ['constructor']: typeof RoutinesCommandLE;

	/**
	 * @inheritdoc
	 */
	public static readonly LITTLE_ENDIAN = true;
}
