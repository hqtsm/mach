import { constant, member, Struct, uint32 } from '@hqtsm/struct';
import { Dylib } from './dylib.ts';

/**
 * Dynamically linked shared library command.
 */
export class DylibCommand extends Struct {
	declare public readonly ['constructor']: Omit<typeof DylibCommand, 'new'>;

	/**
	 * Command type.
	 */
	declare public cmd: number;

	/**
	 * Command size.
	 */
	declare public cmdsize: number;

	/**
	 * Library identification.
	 */
	declare public dylib: Dylib;

	static {
		uint32(this, 'cmd');
		uint32(this, 'cmdsize');
		member(Dylib, this, 'dylib');
		constant(this, 'BYTE_LENGTH');
	}
}
