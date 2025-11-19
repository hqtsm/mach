import { type Class, constant, toStringTag } from '@hqtsm/class';
import { Struct, uint32 } from '@hqtsm/struct';

/**
 * Routines command, 32-bit.
 */
export class RoutinesCommand extends Struct {
	declare public readonly ['constructor']: Class<typeof RoutinesCommand>;

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

	static {
		toStringTag(this, 'RoutinesCommand');
		uint32(this, 'cmd');
		uint32(this, 'cmdsize');
		uint32(this, 'initAddress');
		uint32(this, 'initModule');
		uint32(this, 'reserved1');
		uint32(this, 'reserved2');
		uint32(this, 'reserved3');
		uint32(this, 'reserved4');
		uint32(this, 'reserved5');
		uint32(this, 'reserved6');
		constant(this, 'BYTE_LENGTH');
	}
}
