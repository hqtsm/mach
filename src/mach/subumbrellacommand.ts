/* eslint-disable max-classes-per-file */
import {Struct, structT, structU32} from '../struct.ts';
import {LcStr, LcStrBE} from './lcstr.ts';

/**
 * Sub umbrella command.
 */
export class SubUmbrellaCommand extends Struct {
	public declare readonly ['constructor']: typeof SubUmbrellaCommand;

	/**
	 * Command type.
	 */
	public declare cmd: number;

	/**
	 * Command size.
	 */
	public declare cmdsize: number;

	/**
	 * The sub_umbrella framework name.
	 */
	// eslint-disable-next-line max-len
	public declare readonly sub_umbrella: this['constructor']['LcStr']['prototype'];

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
		o += structT(this, o, 'sub_umbrella', 'LcStr');
		return o;
	})(super.BYTE_LENGTH);
}

/**
 * Sub umbrella command, big endian.
 */
export class SubUmbrellaCommandBE extends SubUmbrellaCommand {
	public declare readonly ['constructor']: typeof SubUmbrellaCommandBE;

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
 * Sub umbrella command, little endian.
 */
export class SubUmbrellaCommandLE extends SubUmbrellaCommand {
	public declare readonly ['constructor']: typeof SubUmbrellaCommandLE;

	/**
	 * @inheritdoc
	 */
	public static readonly LITTLE_ENDIAN = true;

	/**
	 * @inheritdoc
	 */
	public static readonly LcStr = LcStrBE;
}
