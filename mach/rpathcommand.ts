import { Struct, structT, structU32 } from '../struct.ts';
import { LcStr, LcStrBE } from './lcstr.ts';

/**
 * Rpath command.
 */
export class RpathCommand extends Struct {
	declare public readonly ['constructor']: typeof RpathCommand;

	/**
	 * Command type.
	 */
	declare public cmd: number;

	/**
	 * Command size.
	 */
	declare public cmdsize: number;

	/**
	 * Path to add to run path.
	 */
	declare public readonly path: this['constructor']['LcStr']['prototype'];

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
		o += structT(this, o, 'path', 'LcStr');
		return o;
	})(super.BYTE_LENGTH);
}

/**
 * Rpath command, big endian.
 */
export class RpathCommandBE extends RpathCommand {
	declare public readonly ['constructor']: typeof RpathCommandBE;

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
 * Rpath command, little endian.
 */
export class RpathCommandLE extends RpathCommand {
	declare public readonly ['constructor']: typeof RpathCommandLE;

	/**
	 * @inheritdoc
	 */
	public static override readonly LITTLE_ENDIAN = true;

	/**
	 * @inheritdoc
	 */
	public static override readonly LcStr = LcStrBE;
}
