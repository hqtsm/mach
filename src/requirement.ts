import {Blob} from './blob.ts';
import {kSecCodeMagicRequirement} from './const.ts';
import {memberU32} from './member.ts';
import {constant} from './util.ts';

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

	static {
		let {sizeof} = this;
		sizeof += memberU32(this, sizeof, 'kind', false);
		constant(this, 'sizeof', sizeof);
		constant(this, 'typeMagic', kSecCodeMagicRequirement);
		constant(this, 'baseAlignment');
		constant(this, 'exprForm');
		constant(this, 'lwcrForm');
	}
}
