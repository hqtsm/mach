import { type Class, constant, toStringTag } from '@hqtsm/class';
import { kSecCodeMagicRequirementSet } from '../const.ts';
import { SuperBlob } from './superblob.ts';

/**
 * Requirement groups indexed by SecRequirementType.
 */
export class Requirements extends SuperBlob {
	declare public readonly ['constructor']: Class<typeof Requirements>;

	public static override readonly typeMagic = kSecCodeMagicRequirementSet;

	static {
		toStringTag(this, 'Requirements');
		constant(this, 'typeMagic');
	}
}
