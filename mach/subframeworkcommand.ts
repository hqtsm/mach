/* eslint-disable max-classes-per-file */
import { Struct, structT, structU32 } from '../struct.ts';
import { LcStr, LcStrBE } from './lcstr.ts';

/**
 * Sub framework command.
 */
export class SubFrameworkCommand extends Struct {
	declare public readonly ['constructor']: typeof SubFrameworkCommand;

	/**
	 * Command type.
	 */
	declare public cmd: number;

	/**
	 * Command size.
	 */
	declare public cmdsize: number;

	/**
	 * The umbrella framework name.
	 */
	declare public readonly umbrella: this['constructor']['LcStr']['prototype'];

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
		o += structT(this, o, 'umbrella', 'LcStr');
		return o;
	})(super.BYTE_LENGTH);
}

/**
 * Sub framework command, big endian.
 */
export class SubFrameworkCommandBE extends SubFrameworkCommand {
	declare public readonly ['constructor']: typeof SubFrameworkCommandBE;

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
 * Sub framework command, little endian.
 */
export class SubFrameworkCommandLE extends SubFrameworkCommand {
	declare public readonly ['constructor']: typeof SubFrameworkCommandLE;

	/**
	 * @inheritdoc
	 */
	public static override readonly LITTLE_ENDIAN = true;

	/**
	 * @inheritdoc
	 */
	public static override readonly LcStr = LcStrBE;
}
