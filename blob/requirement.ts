import { type Class, constant, toStringTag } from '@hqtsm/class';
import { uint32BE } from '@hqtsm/struct';
import { kSecCodeMagicRequirement } from '../const.ts';
import { Blob } from './blob.ts';

/**
 * Single requirement.
 */
export class Requirement extends Blob {
	declare public readonly ['constructor']: Class<typeof Requirement>;

	/**
	 * Requirement kind.
	 */
	declare private mKind: number;

	/**
	 * Get kind.
	 *
	 * @param self This.
	 * @returns Kind.
	 */
	public static kind(self: Requirement): number;

	/**
	 * Set kind.
	 *
	 * @param self This.
	 * @param k Kind.
	 */
	public static kind(self: Requirement, k: number): void;

	/**
	 * Get or set kind.
	 *
	 * @param self This.
	 * @param k Kind to set or undefined to get.
	 * @returns Kind on get or undefined on set.
	 */
	public static kind(
		self: Requirement,
		k?: number | undefined,
	): number | void {
		if (k === undefined) {
			return self.mKind;
		}
		self.mKind = k >>> 0;
	}

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
		toStringTag(this, 'Requirement');
		uint32BE(this, 'mKind' as never);
		constant(this, 'BYTE_LENGTH');
		constant(this, 'typeMagic');
		constant(this, 'baseAlignment');
		constant(this, 'exprForm');
		constant(this, 'lwcrForm');
	}
}
