import { kSecCodeMagicRequirement } from '../const.ts';
import { structU32 } from '../struct.ts';

import { Blob } from './blob.ts';

/**
 * Single requirement.
 */
export class Requirement extends Blob {
	declare public readonly ['constructor']: typeof Requirement;

	/**
	 * Requirement kind.
	 */
	declare public kind: number;

	/**
	 * @inheritdoc
	 */
	public static override readonly typeMagic = kSecCodeMagicRequirement;

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
	public static override readonly BYTE_LENGTH: number = ((o) => {
		o += structU32(this, o, 'kind', false);
		return o;
	})(super.BYTE_LENGTH);
}
