import {kSecCodeMagicRequirement} from '../const.ts';
import {memberU32} from '../member.ts';
import {constant} from '../util.ts';

import {Blob} from './blob.ts';

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
		let {BYTE_LENGTH: o} = this;
		o += memberU32(this, o, 'kind', false);
		constant(this, 'BYTE_LENGTH', o);
		constant(this, 'typeMagic', kSecCodeMagicRequirement);
		constant(this, 'baseAlignment');
		constant(this, 'exprForm');
		constant(this, 'lwcrForm');
	}
}
