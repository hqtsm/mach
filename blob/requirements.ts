import { constant } from '@hqtsm/struct';
import { kSecCodeMagicRequirementSet } from '../const.ts';
import { SuperBlob } from './superblob.ts';

/**
 * Requirement groups indexed by SecRequirementType.
 */
export class Requirements extends SuperBlob {
	declare public readonly ['constructor']: Omit<typeof Requirements, 'new'>;

	public static override readonly typeMagic = kSecCodeMagicRequirementSet;

	static {
		constant(this, 'typeMagic');
	}
}
