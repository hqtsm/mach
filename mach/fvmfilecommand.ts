/* eslint-disable max-classes-per-file */
import { Struct, structT, structU32 } from '../struct.ts';
import { LcStr, LcStrBE, LcStrLE } from './lcstr.ts';

/**
 * Fixed virtual memory file command.
 */
export class FvmfileCommand extends Struct {
	declare public readonly ['constructor']: typeof FvmfileCommand;

	/**
	 * Command type.
	 */
	declare public cmd: number;

	/**
	 * Command size.
	 */
	declare public cmdsize: number;

	/**
	 * File pathname.
	 */
	declare public readonly name: this['constructor']['LcStr']['prototype'];

	/**
	 * File virtual address.
	 */
	declare public headerAddr: number;

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
		o += structU32(this, o, 'headerAddr');
		return o;
	})(super.BYTE_LENGTH);
}

/**
 * Fixed virtual memory file command, big endian.
 */
export class FvmfileCommandBE extends FvmfileCommand {
	declare public readonly ['constructor']: typeof FvmfileCommandBE;

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
 * Fixed virtual memory file command, little endian.
 */
export class FvmfileCommandLE extends FvmfileCommand {
	declare public readonly ['constructor']: typeof FvmfileCommandLE;

	/**
	 * @inheritdoc
	 */
	public static override readonly LITTLE_ENDIAN = true;

	/**
	 * @inheritdoc
	 */
	public static override readonly LcStr = LcStrLE;
}
