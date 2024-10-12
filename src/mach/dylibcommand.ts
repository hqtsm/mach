/* eslint-disable max-classes-per-file */
import {Struct, structT, structU32} from '../struct.ts';
import {Dylib, DylibBE} from './dylib.ts';

/**
 * Dynamically linked shared library command.
 */
export class DylibCommand extends Struct {
	public declare readonly ['constructor']: typeof DylibCommand;

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
	public declare readonly dylib: this['constructor']['Dylib']['prototype'];

	/**
	 * Dylib reference.
	 */
	public static readonly Dylib = Dylib;

	/**
	 * @inheritdoc
	 */
	public static readonly BYTE_LENGTH = (o => {
		o += structU32(this, o, 'cmd');
		o += structU32(this, o, 'cmdsize');
		o += structT(this, o, 'dylib', 'Dylib');
		return o;
	})(super.BYTE_LENGTH);
}

/**
 * Dynamically linked shared library command, big endian.
 */
export class DylibCommandBE extends DylibCommand {
	public declare readonly ['constructor']: typeof DylibCommandBE;

	/**
	 * @inheritdoc
	 */
	public static readonly LITTLE_ENDIAN = false;

	/**
	 * @inheritdoc
	 */
	public static readonly Dylib = DylibBE;
}

/**
 * Dynamically linked shared library command, little endian.
 */
export class DylibCommandLE extends DylibCommand {
	public declare readonly ['constructor']: typeof DylibCommandLE;

	/**
	 * @inheritdoc
	 */
	public static readonly LITTLE_ENDIAN = true;

	/**
	 * @inheritdoc
	 */
	public static readonly Dylib = DylibBE;
}
