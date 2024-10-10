import {kSecCodeMagicRequirement} from '../const.ts';
import {structU32} from '../struct.ts';
import {constant} from '../util.ts';

import {blob, Blob} from './blob.ts';

/**
 * Single requirement.
 */
export class Requirement extends Blob {
	public declare readonly ['constructor']: typeof Requirement;

	/**
	 * Requirement kind.
	 */
	public declare kind: number;

	/**
	 * @inheritdoc
	 */
	public static readonly typeMagic = kSecCodeMagicRequirement;

	/**
	 * Common alignment rule for all requirement forms.
	 */
	public static readonly baseAlignment: number = 4;

	/**
	 * Kind: Prefix expr form.
	 */
	public static readonly exprForm = 1;

	/**
	 * Kind: DER encoded lightweight code requirement form.
	 */
	public static readonly lwcrForm = 2;

	/**
	 * @inheritdoc
	 */
	public static BYTE_LENGTH = (o => {
		o += structU32(this, o, 'kind', false);
		return o;
	})(super.BYTE_LENGTH);

	static {
		blob(this);
		constant(this, 'baseAlignment');
		constant(this, 'exprForm');
		constant(this, 'lwcrForm');
	}
}
