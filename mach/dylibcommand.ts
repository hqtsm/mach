import { Struct, structT, structU32 } from '../struct.ts';
import { Dylib } from './dylib.ts';

/**
 * Dynamically linked shared library command.
 */
export class DylibCommand extends Struct {
	declare public readonly ['constructor']: typeof DylibCommand;

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
	declare public readonly dylib: this['constructor']['Dylib']['prototype'];

	/**
	 * Dylib reference.
	 */
	public static readonly Dylib = Dylib;

	/**
	 * @inheritdoc
	 */
	public static override readonly BYTE_LENGTH: number = ((o) => {
		o += structU32(this, o, 'cmd');
		o += structU32(this, o, 'cmdsize');
		o += structT(this, o, 'dylib', 'Dylib');
		return o;
	})(super.BYTE_LENGTH);
}
