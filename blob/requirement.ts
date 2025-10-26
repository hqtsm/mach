import { constant, uint32BE } from '@hqtsm/struct';
import { kSecCodeMagicRequirement } from '../const.ts';
import { type BlobConstructor, templateBlob } from './blob.ts';

const Blob: BlobConstructor<
	Requirement,
	typeof kSecCodeMagicRequirement
> = templateBlob(
	() => Requirement,
	kSecCodeMagicRequirement,
);

/**
 * Single requirement.
 */
export class Requirement extends Blob {
	declare public readonly ['constructor']: Omit<typeof Requirement, 'new'>;

	/**
	 * Requirement kind.
	 */
	declare public kind: number;

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
