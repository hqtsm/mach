/* eslint-disable max-classes-per-file */
import {Struct, structT, structU32} from '../struct.ts';
import {Fvmlib, FvmlibBE} from './fvmlib.ts';

/**
 * Fixed virtual memory shared library command.
 */
export class FvmlibCommand extends Struct {
	public declare readonly ['constructor']: typeof FvmlibCommand;

	/**
	 * Command type.
	 */
	public declare cmd: number;

	/**
	 * Command size.
	 */
	public declare cmdsize: number;

	/**
	 * Library identification.
	 */
	public declare readonly name: this['constructor']['Fvmlib']['prototype'];

	/**
	 * Fvmlib reference.
	 */
	public static readonly Fvmlib = Fvmlib;

	/**
	 * @inheritdoc
	 */
	public static BYTE_LENGTH = (o => {
		o += structU32(this, o, 'cmd');
		o += structU32(this, o, 'cmdsize');
		o += structT(this, 'Fvmlib', o, 'name');
		return o;
	})(super.BYTE_LENGTH);
}

/**
 * Fixed virtual memory shared library command, big endian.
 */
export class FvmlibCommandBE extends FvmlibCommand {
	public declare readonly ['constructor']: typeof FvmlibCommandBE;

	/**
	 * @inheritdoc
	 */
	public static readonly LITTLE_ENDIAN = false;

	/**
	 * @inheritdoc
	 */
	public static readonly Fvmlib = FvmlibBE;
}

/**
 * Fixed virtual memory shared library command, little endian.
 */
export class FvmlibCommandLE extends FvmlibCommand {
	public declare readonly ['constructor']: typeof FvmlibCommandLE;

	/**
	 * @inheritdoc
	 */
	public static readonly LITTLE_ENDIAN = true;

	/**
	 * @inheritdoc
	 */
	public static readonly Fvmlib = FvmlibBE;
}
