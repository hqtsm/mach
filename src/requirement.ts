import {Blob} from './blob.ts';
import {kSecCodeMagicRequirement} from './const.ts';

/**
 * Requirement Blob.
 */
export class Requirement extends Blob {
	public declare readonly ['constructor']: typeof Requirement;

	/**
	 * Requirement kind.
	 *
	 * @returns Requirement kind.
	 */
	public get kind() {
		return this.data.getUint32(8);
	}

	/**
	 * Requirement kind.
	 *
	 * @param k Requirement kind.
	 */
	public set kind(k: number) {
		this.data.setUint32(8, k);
	}

	/**
	 * @inheritdoc
	 */
	public static readonly sizeof: number = 12;

	/**
	 * @inheritdoc
	 */
	public static readonly typeMagic: number = kSecCodeMagicRequirement;

	/**
	 * Common alignment rule for all requirement forms.
	 */
	public static readonly baseAlignment: number = 4;

	/**
	 * Different forms of requirements.
	 */
	public static readonly Kind = {
		/**
		 * Prefix expr form.
		 */
		exprForm: 1,

		/**
		 * DER encoded lightweight code requirement form.
		 */
		lwcrForm: 2
	};
}
