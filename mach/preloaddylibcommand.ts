/* eslint-disable max-classes-per-file */
import { Struct, structT, structU32 } from '../struct.ts';
import { LcStr, LcStrBE } from './lcstr.ts';

/**
 * Preload dylib command.
 */
export class PreloadDylibCommand extends Struct {
	declare public readonly ['constructor']: typeof PreloadDylibCommand;

	/**
	 * Command type.
	 */
	declare public cmd: number;

	/**
	 * Command size.
	 */
	declare public cmdsize: number;

	/**
	 * Path name.
	 */
	declare public readonly name: this['constructor']['LcStr']['prototype'];

	/**
	 * Number of modules.
	 */
	declare public nmodules: number;

	/**
	 * Bit vector of linked modules.
	 */
	// eslint-disable-next-line max-len
	declare public readonly linkedModules:
		this['constructor']['LcStr']['prototype'];

	/**
	 * LcStr reference.
	 */
	public static readonly LcStr = LcStr;

	/**
	 * @inheritdoc
	 */
	public static override readonly BYTE_LENGTH = ((o) => {
		o += structU32(this, o, 'cmd');
		o += structU32(this, o, 'cmdsize');
		o += structT(this, o, 'name', 'LcStr');
		o += structU32(this, o, 'nmodules');
		o += structT(this, o, 'linkedModules', 'LcStr');
		return o;
	})(super.BYTE_LENGTH);
}

/**
 * Preload dylib command, big endian.
 */
export class PreloadDylibCommandBE extends PreloadDylibCommand {
	declare public readonly ['constructor']: typeof PreloadDylibCommandBE;

	/**
	 * @inheritdoc
	 */
	public static override readonly LITTLE_ENDIAN = false;

	/**
	 * @inheritdoc
	 */
	public static override readonly LcStr = LcStrBE;
}

/**
 * Preload dylib command, little endian.
 */
export class PreloadDylibCommandLE extends PreloadDylibCommand {
	declare public readonly ['constructor']: typeof PreloadDylibCommandLE;

	/**
	 * @inheritdoc
	 */
	public static override readonly LITTLE_ENDIAN = true;

	/**
	 * @inheritdoc
	 */
	public static override readonly LcStr = LcStrBE;
}
