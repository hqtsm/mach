import {Blob} from './blob.ts';
import {kSecCodeMagicRequirement} from './const.ts';

/**
 * Single requirement.
 */
export class Requirement extends Blob(kSecCodeMagicRequirement) {
	public declare readonly ['constructor']: typeof Requirement;

	/**
	 * Requirement kind.
	 *
	 * @returns Requirement kind.
	 */
	public get kind() {
		return this.dataView.getUint32(8);
	}

	/**
	 * Requirement kind.
	 *
	 * @param k Requirement kind.
	 */
	public set kind(k: number) {
		this.dataView.setUint32(8, k);
	}

	/**
	 * @inheritdoc
	 */
	public static readonly sizeof: number = 12;

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
}
