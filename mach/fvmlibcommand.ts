import { Struct, structT, structU32 } from '../struct.ts';
import { Fvmlib } from './fvmlib.ts';

/**
 * Fixed virtual memory shared library command.
 */
export class FvmlibCommand extends Struct {
	declare public readonly ['constructor']: typeof FvmlibCommand;

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
	declare public readonly fvmlib: this['constructor']['Fvmlib']['prototype'];

	/**
	 * Fvmlib reference.
	 */
	public static readonly Fvmlib = Fvmlib;

	/**
	 * @inheritdoc
	 */
	public static override readonly BYTE_LENGTH: number = ((o) => {
		o += structU32(this, o, 'cmd');
		o += structU32(this, o, 'cmdsize');
		o += structT(this, o, 'fvmlib', 'Fvmlib');
		return o;
	})(super.BYTE_LENGTH);
}
