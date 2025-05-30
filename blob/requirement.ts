import { constant, uint32BE } from '@hqtsm/struct';
import { kSecCodeMagicRequirement } from '../const.ts';
import { Blob } from './blob.ts';

/**
 * Single requirement.
 */
export class Requirement extends Blob {
	declare public readonly ['constructor']: Omit<typeof Requirement, 'new'>;

	/**
	 * Requirement kind.
	 */
	declare public kind: number;

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

	static {
		uint32BE(this, 'kind');
		constant(this, 'BYTE_LENGTH');
		constant(this, 'typeMagic');
		constant(this, 'baseAlignment');
		constant(this, 'exprForm');
		constant(this, 'lwcrForm');
	}
}
