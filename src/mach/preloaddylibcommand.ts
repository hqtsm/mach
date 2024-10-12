/* eslint-disable max-classes-per-file */
import {Struct, structT, structU32} from '../struct.ts';
import {LcStr, LcStrBE} from './lcstr.ts';

/**
 * Preload dylib command.
 */
export class PreloadDylibCommand extends Struct {
	public declare readonly ['constructor']: typeof PreloadDylibCommand;

	/**
	 * Command type.
	 */
	public declare cmd: number;

	/**
	 * Command size.
	 */
	public declare cmdsize: number;

	/**
	 * Path name.
	 */
	public declare readonly name: this['constructor']['LcStr']['prototype'];

	/**
	 * Number of modules.
	 */
	public declare nmodules: number;

	/**
	 * Bit vector of linked modules.
	 */
	// eslint-disable-next-line max-len
	public declare readonly linked_modules: this['constructor']['LcStr']['prototype'];

	/**
	 * LcStr reference.
	 */
	public static readonly LcStr = LcStr;

	/**
	 * @inheritdoc
	 */
	public static readonly BYTE_LENGTH = (o => {
		o += structU32(this, o, 'cmd');
		o += structU32(this, o, 'cmdsize');
		o += structT(this, o, 'name', 'LcStr');
		o += structU32(this, o, 'nmodules');
		o += structT(this, o, 'linked_modules', 'LcStr');
		return o;
	})(super.BYTE_LENGTH);
}

/**
 * Preload dylib command, big endian.
 */
export class PreloadDylibCommandBE extends PreloadDylibCommand {
	public declare readonly ['constructor']: typeof PreloadDylibCommandBE;

	/**
	 * @inheritdoc
	 */
	public static readonly LITTLE_ENDIAN = false;

	/**
	 * @inheritdoc
	 */
	public static readonly LcStr = LcStrBE;
}

/**
 * Preload dylib command, little endian.
 */
export class PreloadDylibCommandLE extends PreloadDylibCommand {
	public declare readonly ['constructor']: typeof PreloadDylibCommandLE;

	/**
	 * @inheritdoc
	 */
	public static readonly LITTLE_ENDIAN = true;

	/**
	 * @inheritdoc
	 */
	public static readonly LcStr = LcStrBE;
}
