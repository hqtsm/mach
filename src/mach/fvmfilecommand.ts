/* eslint-disable max-classes-per-file */
import {Struct, structT, structU32} from '../struct.ts';
import {LcStr, LcStrBE, LcStrLE} from './lcstr.ts';

/**
 * Fixed virtual memory file command.
 */
export class FvmfileCommand extends Struct {
	public declare readonly ['constructor']: typeof FvmfileCommand;

	/**
	 * Command type.
	 */
	public declare cmd: number;

	/**
	 * Command size.
	 */
	public declare cmdsize: number;

	/**
	 * File pathname.
	 */
	public declare readonly name: this['constructor']['LcStr']['prototype'];

	/**
	 * File virtual address.
	 */
	public declare headerAddr: number;

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
		o += structU32(this, o, 'headerAddr');
		return o;
	})(super.BYTE_LENGTH);
}

/**
 * Fixed virtual memory file command, big endian.
 */
export class FvmfileCommandBE extends FvmfileCommand {
	public declare readonly ['constructor']: typeof FvmfileCommandBE;

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
 * Fixed virtual memory file command, little endian.
 */
export class FvmfileCommandLE extends FvmfileCommand {
	public declare readonly ['constructor']: typeof FvmfileCommandLE;

	/**
	 * @inheritdoc
	 */
	public static readonly LITTLE_ENDIAN = true;

	/**
	 * @inheritdoc
	 */
	public static readonly LcStr = LcStrLE;
}
