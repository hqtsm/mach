import { Struct, structT, structU32 } from '../struct.ts';
import { LcStr } from './lcstr.ts';

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
	declare public readonly linkedModules:
		this['constructor']['LcStr']['prototype'];

	/**
	 * LcStr reference.
	 */
	public static readonly LcStr = LcStr;

	/**
	 * @inheritdoc
	 */
	public static override readonly BYTE_LENGTH: number = ((o) => {
		o += structU32(this, o, 'cmd');
		o += structU32(this, o, 'cmdsize');
		o += structT(this, o, 'name', 'LcStr');
		o += structU32(this, o, 'nmodules');
		o += structT(this, o, 'linkedModules', 'LcStr');
		return o;
	})(super.BYTE_LENGTH);
}
