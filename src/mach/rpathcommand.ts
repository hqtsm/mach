/* eslint-disable max-classes-per-file */
import {Struct, structT, structU32} from '../struct.ts';
import {LcStr, LcStrBE} from './lcstr.ts';

/**
 * Rpath command.
 */
export class RpathCommand extends Struct {
	public declare readonly ['constructor']: typeof RpathCommand;

	/**
	 * Command type.
	 */
	public declare cmd: number;

	/**
	 * Command size.
	 */
	public declare cmdsize: number;

	/**
	 * Path to add to run path.
	 */
	public declare readonly path: this['constructor']['LcStr']['prototype'];

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
		o += structT(this, o, 'path', 'LcStr');
		return o;
	})(super.BYTE_LENGTH);
}

/**
 * Rpath command, big endian.
 */
export class RpathCommandBE extends RpathCommand {
	public declare readonly ['constructor']: typeof RpathCommandBE;

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
 * Rpath command, little endian.
 */
export class RpathCommandLE extends RpathCommand {
	public declare readonly ['constructor']: typeof RpathCommandLE;

	/**
	 * @inheritdoc
	 */
	public static readonly LITTLE_ENDIAN = true;

	/**
	 * @inheritdoc
	 */
	public static readonly LcStr = LcStrBE;
}
