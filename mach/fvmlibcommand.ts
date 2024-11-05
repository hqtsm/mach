/* eslint-disable max-classes-per-file */
import { Struct, structT, structU32 } from '../struct.ts';
import { Fvmlib, FvmlibBE } from './fvmlib.ts';

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
	public static override readonly BYTE_LENGTH = ((o) => {
		o += structU32(this, o, 'cmd');
		o += structU32(this, o, 'cmdsize');
		o += structT(this, o, 'fvmlib', 'Fvmlib');
		return o;
	})(super.BYTE_LENGTH);
}

/**
 * Fixed virtual memory shared library command, big endian.
 */
export class FvmlibCommandBE extends FvmlibCommand {
	declare public readonly ['constructor']: typeof FvmlibCommandBE;

	/**
	 * @inheritdoc
	 */
	public static override readonly LITTLE_ENDIAN = false;

	/**
	 * @inheritdoc
	 */
	public static override readonly Fvmlib = FvmlibBE;
}

/**
 * Fixed virtual memory shared library command, little endian.
 */
export class FvmlibCommandLE extends FvmlibCommand {
	declare public readonly ['constructor']: typeof FvmlibCommandLE;

	/**
	 * @inheritdoc
	 */
	public static override readonly LITTLE_ENDIAN = true;

	/**
	 * @inheritdoc
	 */
	public static override readonly Fvmlib = FvmlibBE;
}
