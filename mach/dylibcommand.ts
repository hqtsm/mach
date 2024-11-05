import { Struct, structT, structU32 } from '../struct.ts';
import { Dylib, DylibBE } from './dylib.ts';

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

/**
 * Dynamically linked shared library command, big endian.
 */
export class DylibCommandBE extends DylibCommand {
	declare public readonly ['constructor']: typeof DylibCommandBE;

	/**
	 * @inheritdoc
	 */
	public static override readonly LITTLE_ENDIAN = false;

	/**
	 * @inheritdoc
	 */
	public static override readonly Dylib = DylibBE;
}

/**
 * Dynamically linked shared library command, little endian.
 */
export class DylibCommandLE extends DylibCommand {
	declare public readonly ['constructor']: typeof DylibCommandLE;

	/**
	 * @inheritdoc
	 */
	public static override readonly LITTLE_ENDIAN = true;

	/**
	 * @inheritdoc
	 */
	public static override readonly Dylib = DylibBE;
}
