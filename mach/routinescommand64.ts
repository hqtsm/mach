import { type Class, constant } from '@hqtsm/class';
import { Struct, uint32, uint64 } from '@hqtsm/struct';

/**
 * Routines command, 64-bit.
 */
export class RoutinesCommand64 extends Struct {
	declare public readonly ['constructor']: Class<typeof RoutinesCommand64>;

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

	static {
		uint32(this, 'cmd');
		uint32(this, 'cmdsize');
		uint64(this, 'initAddress');
		uint64(this, 'initModule');
		uint64(this, 'reserved1');
		uint64(this, 'reserved2');
		uint64(this, 'reserved3');
		uint64(this, 'reserved4');
		uint64(this, 'reserved5');
		uint64(this, 'reserved6');
		constant(this, 'BYTE_LENGTH');
	}
}
