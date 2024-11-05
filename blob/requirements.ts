import { kSecCodeMagicRequirementSet } from '../const.ts';

import { SuperBlob } from './superblob.ts';

/**
 * Requirement groups indexed by SecRequirementType.
 */
export class Requirements extends SuperBlob {
	declare public readonly ['constructor']: typeof Requirements;

	/**
	 * @inheritdoc
	 */
	public static override readonly typeMagic = kSecCodeMagicRequirementSet;
}
